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
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        priority TEXT NOT NULL,
        status TEXT NOT NULL
      )
    `)
  }

  createTodo(todo: Todo): Todo {
    const stmt = this.#client.prepare(`
      INSERT INTO todos (title, content, priority, status)
      VALUES (@title ,@content, @priority, @status)
    `)

    const info = stmt.run(todo)
    return { ...todo, id: info.lastInsertRowid }
  }

  listTodos(): Todo[] {
    const stmt = this.#client.prepare<Todo[]>('SELECT * FROM todos')
    return stmt.all()
  }

  getTodo(id: number | bigint | undefined): Todo {
    const stmt = this.#client.prepare('SELECT * FROM todos WHERE id = ?')
    return stmt.get(id)
  }

  updateTodo(todo: Todo): Todo {
    const stmt = this.#client.prepare(`
      UPDATE todos
      SET title = @title,
          content = @content,
          priority = @priority,
          status = @status
      WHERE id = @id
    `)
    return todo
  }

  deleteTodo(id: number | bigint | undefined): void {
    const stmt = this.#client.prepare('DELETE FROM todos WHERE id = ?')
    stmt.run(id)
  }

}
