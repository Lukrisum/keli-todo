# keli-todo Design

## $ keli new --help
```
创建一条新的待办事项

USAGE
  $ keli new [-t <value>] [-c <value>]

FLAGS
  -c, --content=<value>  待办事项的具体内容
  -t, --title=<value>    待办事项的标题

DESCRIPTION
  创建一条新的待办事项

EXAMPLES
  $ keli new --title "闪" --content "明天下午 5:00 ，天健运动场，与 halalala222"
```
## $ keli list --help
```
列出所有待办事项

USAGE
  $ keli list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ] [--json]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  列出所有待办事项
```

## LICENSE
[MIT](https://github.com/Lukrisum/keli-todo/blob/main/LICENSE)
