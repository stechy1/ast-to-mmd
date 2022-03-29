# AST-to-MMD

Simple utility to transform your TS code to [MermaidJS](http://mermaid-js.github.io/mermaid/) syntax for [flowcharts](http://mermaid-js.github.io/mermaid/#/flowchart).

New file *.mmd is generated next to each TS file which fulfilled condition.

## Usage

Install utility as **dev dependency**: `npm install --dev @stechy1/ast-to-mmd`.
Run it with `npx @stechy1/ast-to-mmd`.

### Options

* -p, --path &lt;path>: Defines path where to find (one) source file,
* -d, --directory &lt;path>: Defines path to directory where to find source files,
* -ts, --tsConfig &lt;tsConfigPath>: Defines path to project ts-config.json file,
* -g, --idGenerator &lt;type>: Defines type of ID generator ('uuid' | 'incremental'), default='incremental',
* -f, --fileFilter &lt;fileFilterPath>: Defines path to file with filter rules.

## Supported constructs

* function call
* [conditions](https://stechy1.github.io/ast-to-mmd/classes/IfElseDeclarationGraphBlock.html#readme)
  * return
  * break
  * throw
* [for cycles](https://stechy1.github.io/ast-to-mmd/classes/ForDeclarationGraphBlock.html#readme)
  * continue
  * return
  * break
  * throw
* [try-catch-finaly](https://stechy1.github.io/ast-to-mmd/classes/TryCatchDeclarationGraphBlock.html#readme)
  * return
  * break
  * throw
* [switch-case](https://stechy1.github.io/ast-to-mmd/classes/SwitchDeclarationGraphBlock.html#readme)
  * return
  * break
  * throw

## Filter conditions

### JSON conditions

Supported logical condition constructs:

* and: all conditions must be fulfilled
* or: some of the conditions must be fulfilled
* not: negate condition
  Supported functional condition constructs:
* contains: tested file path must contain defined string
* endsWith: tested file path must ends with defined string

Example of simmple JSON conditions:

```json
{
  "and": [
    {
      "endsWith": "handler.ts",
      "contains": "event",
      "not": {
        "contains": "entity"
      }
    }
  ]
}
```
