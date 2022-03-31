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

### Example of rendered code

**source code**

```
function fun() {
  foo();

  for (let i = 0; i < 10; i++) {
    bar();
    baz();
  }

  fooBar();
}
```

**transformed to mmd syntax**

```
flowchart TD
subgraph 600 ["Functions"]
direction TB
   subgraph 580 ["fun"]
    direction TB
      581[["foo()"]]
      subgraph 595_16 ["CYCLE_16"]
       direction TB
        595[/"i = 0; i < 10; i++"/]
        582[["bar()"]]
        583[["baz()"]]
        595 ---> 582
         583 -. "loop_16" .-> 595
         582 ---> 583
      end
      596[["fooBar()"]]
       581 ---> 595
       583 ---> 596
   end
end
subgraph 601 ["Classes"]
   direction TB
end
```

**rendered result**
![Diagram result](https://stechy1.github.io/ast-to-mmd/docu-graph-generated/for_cycle_full.png)

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

