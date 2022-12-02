import { Command } from '@oclif/core'
import inquirer from 'inquirer'
import common from 'mocha/lib/interfaces/common'
import { existsSync, lstatSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

export abstract class ExtendCmd extends Command {

  async initDataDir(): Promise<string> {
    const configs = UserConfig.get(this)

    let dataDir = configs.dataDir
    if (!dataDir) {
      let res = await inquirer.prompt([
        {
          name: 'dataDir',
          message: `初始化数据存放目录（的绝对路径），默认为：`,
          default: this.config.dataDir
        }
      ])

      if (existsSync(res.dataDir) && !lstatSync(res.dataDir).isDirectory()) {
        this.error(`INIT DATADIR: Path ${res.dataDir} is not a !`)
      } else {
        const resNext = await inquirer.prompt([
          {
            name: 'next',
            message: `设置数据存放目录为：${res.dataDir}？`,
            type: 'confirm'
          }
        ])
        const next = resNext.next

        if (!next) {
          this.exit()
        }

        dataDir = res.dataDir
      }

    }

    UserConfig.set(this, { ...configs, dataDir })
    return dataDir
  }
}

export class UserConfig {

  private static path = '../config.json'

  constructor() { }

  public static get(command: Command) {
    if (!existsSync(path.join(__dirname, this.path))) {
      command.error("READ: File 'config.json' does not exits!")
    }
    return JSON.parse(readFileSync(path.join(__dirname, this.path), "utf8"));
  }

  public static set(command: Command, configs: any) {
    if (!existsSync(path.join(__dirname, this.path))) {
      command.error("WRITE: File 'config.json' does not exits!")
    }
    writeFileSync(path.join(__dirname, this.path), JSON.stringify(configs));
  }
}
