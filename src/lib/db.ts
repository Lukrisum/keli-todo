import BetterSqlite3 from 'better-sqlite3'
import { Todo } from "./type"
import path from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'

export default class TodoDb {

  #client: BetterSqlite3.Database

  constructor(dataDir: string) {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true })
    }
    this.#client = new BetterSqlite3(path.join(dataDir, 'keli.db'))
    this.setup()
  }

  setup(): void {
    this.#client.exec(`
      CREATE TABLE IF NOT EXISTS todo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT NOT NULL
      )
    `)
  }

  createTodo(todo: Todo): Todo {
    const stmt = this.#client.prepare(`
      INSERT INTO todo (title, content, status)
      VALUES (@title ,@content, @status)
    `)

    const info = stmt.run(todo)
    return { ...todo, id: info.lastInsertRowid }
  }

  // listTodos(): Todo[] { }
  // getTask(id: number): Todo { }
  // completeTodo(id: number): Todo { }
}