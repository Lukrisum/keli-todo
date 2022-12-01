import { Command } from '@oclif/core'
import inquirer from 'inquirer'
import TodoDb from '../lib/db'

export default class Done extends Command {
  #db = new TodoDb(this.config.dataDir)

  static description = '修改某个待办事项的状态'

  public async run(): Promise<void> {

    const todosSoFar = this.#db.listTodos()

    const resIndex = await inquirer.prompt([
      {
        name: 'index',
        message: '选择要修改待办状态的事项',
        type: 'list',
        choices: todosSoFar.map(({ priority, title, content, status }, index) =>
          `${index}) ${priority.slice(1)} | ${title} | ${content} | ${status}`
        )
      }
    ])
    const index = Number(resIndex.index[0])
    const todo = {
      ...todosSoFar[index],
      status: todosSoFar[index].status === 'doing' ? 'done' : 'doing' as 'doing' | 'done'
    }

    const updated = this.#db.updateTodo(todo)
    this.log(`更新待办状态成功 ${updated.priority.slice(1)} | ${updated.title} | ${updated.status}`)
  }
}
