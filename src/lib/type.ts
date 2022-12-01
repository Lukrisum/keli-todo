export type Todo = {
  id?: number | bigint,
  title: string,
  content: string,
  priority: string,
  status: 'doing' | 'done'
}
