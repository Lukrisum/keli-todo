import { CliUx } from '@oclif/core'
import { ExtendCmd } from '../lib/class'
import TodoDb from '../lib/db'
import { Todo } from '../lib/type'

export default class KeliList extends ExtendCmd {
  static description = '列出所有待办事项'

  static flags = {
    ...CliUx.ux.table.flags(),
  }

  public static enableJsonFlag = true

  public async run(): Promise<Todo[]> {
    const db = new TodoDb(await this.initDataDir())
    const { flags } = await this.parse(KeliList)

    const todos = db.listTodos()

    CliUx.ux.table(todos, {
      title: {
        header: "标题"
      },
      priority: {
        header: "优先级",
        minWidth: 12
      },
      status: {
        header: "待办状态",
        minWidth: 20
      },
      content: {
        header: "内容",
        extended: true
      },
    }, {
      printLine: this.log.bind(this),
      ...flags
    })

    return todos
  }
}
