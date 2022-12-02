import { ExtendCmd, UserConfig } from '../lib/class'

export default class Init extends ExtendCmd {
  static description = '初始化数据存放目录'

  public async run(): Promise<void> {
    const configs = UserConfig.get(this)

    let dataDir = configs.dataDir

    if (dataDir) {
      this.log(`数据存放目录已经初始化为：${dataDir}`)
      this.exit()
    }
    this.initDataDir()
  }
}
