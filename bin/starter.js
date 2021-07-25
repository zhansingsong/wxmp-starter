#!/usr/bin/env node
const {execSync} = require('child_process');
const chalk = require('chalk');
const path = require('path');
const ora = require('ora');
const inquirer = require('inquirer');
const fs = require('fs-extra');

// const pkg = require('../package.json');
const projectConfig = require('../project.config.json');

const generateCurrentPath = (p) => path.join(process.cwd(), p);
const generatePath = (p) => path.resolve(__dirname, p);

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
}
const generateProject = (name) => {
  var projectName = name || `wxmp-starter-project-${Date.now()}`;
  var projectPath = generateCurrentPath(projectName);
  if (fs.pathExistsSync(projectPath)) {
    return generateProject();
  }
  projectConfig.projectname = projectName;
  fs.mkdirSync(projectPath);
  return projectPath;
};
inquirer
  .prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '请输入项目名：',
      default: () => {
        return `wxmp-starter-project-${Date.now()}`;
      },
    },
    {
      type: 'input',
      name: 'appid',
      message: `请输入您的微信小程序 ${chalk.green.bold('appid')}：`,
      default: 'touristappid',
    },
  ])
  .then((answers) => {
    console.log();
    console.log(
      `${chalk.bold.gray('[WXMP-STARTER]')} ${chalk.bold.greenBright(
        '→'
      )} ${chalk.bold('开始创建项目……')}`
    );
    const spinner = ora({
      text: chalk.bold.blue('开始创建项目，请稍等……'),
      prefixText: chalk.bold.gray('[WXMP-STARTER]'),
      color: 'cyan',
    }).start();
    projectConfig.appid = answers.appid;
    // 生成项目目录
    try {
      const projectPath = generateProject(answers.projectName);
      const useYarn = false; //shouldUseYarn();

      fs.writeJsonSync(
        path.join(projectPath, 'project.config.json'),
        projectConfig,
        {spaces: 2}
      );
      fs.copySync(generatePath('../template'), projectPath);
      spinner.succeed(`初始化完项目`);
      process.chdir(projectPath);
      spinner.start(`开始安装项目依赖……`);
      execSync('npm install', {stdio: 'inherit'});
      spinner.succeed(
        `项目创建完成 ${chalk.green.bold(
          projectConfig.projectname
        )}(${chalk.underline.gray(projectPath)})`
      );
      const displayedCommand = 'npm';
      console.log();
      console.log('项目中，可以运行如下命令:');
      console.log();
      console.log(chalk.cyan(`  ${displayedCommand} start`));
      console.log('    启动开发环境');
      console.log();
      console.log(
        chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`)
      );
      console.log('    打包构建');
      console.log();
      console.log(
        chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}eslint`)
      );
      console.log('    lint 代码');
      console.log();
      console.log(
        chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}format`)
      );
      console.log('    格式代码');
      console.log();
      console.log('执行如下操作开始小程序开发:');
      console.log();
      console.log(chalk.cyan('  cd'), projectConfig.projectname);
      console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`);
      console.log();
      console.log('开启小程序开发之旅 💻 !');
    } catch (error) {
      console.error(error);
    }
  })
  .catch((error) => {
    console.error(error);
    // if (error.isTtyError) {
    //   // Prompt couldn't be rendered in the current environment
    // } else {
    //   // Something else went wrong
    // }
  });
