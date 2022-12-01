import { Command, Flags } from '@oclif/core'
import inquirer from 'inquirer'
import TodoDb from '../lib/db'
import { Todo } from '../lib/type'

export default class KeliNew extends Command {
  #db = new TodoDb(this.config.dataDir)

  static description = '创建一条新的待办事项'

  static examples = [
    '<%= config.bin %> <%= command.id %> --title "闪" --content "明天下午 5:00 ，天健运动场，与 halalala222"'
  ]

  static flags = {
    title: Flags.string({ char: 't', description: '待办事项的标题' }),
    content: Flags.string({ char: 'c', description: "待办事项的具体内容" })
  }

  public async run(): Promise<void> {
    
    const { flags } = await this.parse(KeliNew)

    let title = flags.title
    if (!title) {
      const res = await inquirer.prompt([
        {
          name: 'title',
          message: '输入标题',
        }
      ])
      title = res.title
    }

    let content = flags.content
    if (!content) {
      const res = await inquirer.prompt([
        {
          name: 'content',
          message: '输入内容'
        }
      ])
      content = res.content
    }

    const resPriority = await inquirer.prompt([
      {
        name: 'priority',
        message: '选择优先级',
        type: 'list',
        choices: ['高 🔥🔥🔥', '中 🔥🔥', '低 🔥']
      }
    ])
    const priority = resPriority.priority

    const todo: Todo = {
      title: title || '',
      content: content || '',
      priority: priority || '',
      status: 'doing'
    }

    const created = this.#db.createTodo(todo)
    this.log(`创建了一个新的代办，优先级：${created.priority}，标题：${created.title}，内容：${created.content}`)
  }
}
