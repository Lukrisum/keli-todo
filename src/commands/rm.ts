import inquirer from 'inquirer'
import { ExtendCmd } from '../lib/class'
import TodoDb from '../lib/db'

export default class Rm extends ExtendCmd {

  static description = '删除某个待办事项'

  public async run(): Promise<void> {
    const db = new TodoDb(await this.initDataDir())
    const todosSoFar = db.listTodos()

    const resIndex = await inquirer.prompt([
      {
        name: 'index',
        message: '选择要删除的事项',
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

    db.deleteTodo(id)
  }
}
