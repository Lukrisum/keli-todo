import { Command } from '@oclif/core'
import { CommandError } from '@oclif/core/lib/interfaces'
import inquirer from 'inquirer'
import { existsSync, lstatSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

// do nothing but produce a link when build
import * as configs from '../config.json'

export abstract class ExtendCmd extends Command {

  protected async catch(err: CommandError): Promise<any> {
    this.error(err)
  }

  async initDataDir(): Promise<string> {
    const configs = UserConfig.get(this)

    let dataDir = configs.dataDir
    if (!dataDir) {
      let res = await inquirer.prompt([
        {
          name: 'dataDir',
          message: `初始化数据存放目录（绝对路径）：`,
          default: this.config.dataDir
        }
      ])

      if (existsSync(res.dataDir)) {
        if (!lstatSync(res.dataDir).isDirectory()) {
          throw new Error(`INIT DATADIR: Path ${res.dataDir} is not a directory!`)
        } else {
          const resNext = await inquirer.prompt([
            {
              name: 'next',
              message: `确认设置数据存放目录为：${res.dataDir}？`,
              type: 'confirm'
            }
          ])
          const next = resNext.next

          if (!next) {
            this.log("初始化目录中断")
            this.exit()
          }

          dataDir = res.dataDir
        }
      } else {
        throw new Error(`INIT DATADIR: Path ${res.dataDir} does not exits!`)
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
      throw new Error("READ: File 'config.json' does not exits!")
    }
    return JSON.parse(readFileSync(path.join(__dirname, this.path), "utf8"));
  }

  public static set(command: Command, configs: any) {
    if (!existsSync(path.join(__dirname, this.path))) {
      throw new Error("WRITE: File 'config.json' does not exits!")
    }
    writeFileSync(path.join(__dirname, this.path), JSON.stringify(configs));
  }
}
