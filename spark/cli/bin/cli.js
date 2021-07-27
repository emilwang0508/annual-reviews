#! /usr/bin/env node

const { fstat } = require('fs');
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const chalk = require('chalk')
const figlet = require('figlet')
const program = require('commander')
const versionPath = path.join(__dirname,'../', 'package.json')

program
  // 定义命令和参数
  .command('create <app-name>')
  .description('create a new project')
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    // 打印执行结果
    console.log('name:',name,'options:',options)
    require('../lib/create.js')(name, options)
  })

// 配置 config 命令
program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from option')
  .option('-s, --set <path> <value>')
  .option('-d, --delete <path>', 'delete option from config')
  .action((value, options) => {
    console.log(value, options)
  })
// 配置 ui 命令
program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action((option) => {
    console.log(option)
  })

program
  // 监听 --help 执行
  .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('Spark', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 100,
        whitespaceBreak: true
    }));
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan(`spark <command> --help`)} for detailed usage of given command\r\n`)
  })

program
    // 解析版本号信息
    .version(`v${require(versionPath).version}`)
    .usage('<command> [option]')

program.parse(process.argv)


// inquirer.prompt([
//     {
//         type: 'input',
//         name: 'name',
//         message: 'Your name',
//         default: 'my-node-cli'
//     }
// ]).then(answers => {
//     console.log(answers)
//     // 模板文件目录
//     const destUrl = path.join(__dirname, 'templates');

//     // process.cwd() 对应控制台所在目录
//     const cwdUrl = process.cwd()

//     // 从模板目录中读取文件
//     fs.readdir(destUrl, (err, files) => {
//         if (err) throw err;
//         files.forEach((file) => {
//             // 使用ejs 渲染对应的模板文件
//             // renderFile (模板文件地址，传入渲染数据)
//             ejs.renderFile(path.join(destUrl, file), answers).then(data => {
//                 // 生成ejs处理后的模板文件
//                 fs.writeFileSync(path.join(cwdUrl, file), data)
//             })
//         })
//     })
    
// })