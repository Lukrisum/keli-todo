import { Command, Flags } from '@oclif/core'
import inquirer from 'inquirer'
import TodoDb from '../lib/db'

export default class Done extends Command {
  #db = new TodoDb(this.config.dataDir)

  static description = '完成并删除某个待办事项'

  public async run(): Promise<void> {
    
    const todosSoFar = this.#db.listTodos()

    const resIndex = await inquirer.prompt([
      {
        name: 'index',
        message: '选择要完成/删除的事项',
        type: 'list',
        choices: todosSoFar.map(({ priority, title, content, status }, index) =>
          `${index}) ${priority.slice(1)} | ${title} | ${content} | ${status}`
        )
      }
    ])
    const index = Number(resIndex.index[0])
    const id = todosSoFar[index].id

    const resNext = await inquirer.prompt([
      {
        name: 'next',
        message: `确认删除：？`,
        type: 'confirm'
      }
    ])
    const next = resNext.next

    if (!next) {
      return;
    }

    this.#db.completeTodo(id)
  }
}
