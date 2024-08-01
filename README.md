# EVA-interpreter

A JavaScript interpreter for the EVA programming language 
(based on the [Dmitry Soshnikov course _Essentials of interpretation_](https://dmitrysoshnikov.teachable.com/courses/enrolled/795712)).

## EVA programming language

EVA is a dynamic programming language with simple syntax, functional heart, and OOP support. The origin of the language
name come from the _eval_ function, which is the core of any interpreter. _eval_ stands for evaluate, that is obtaining
the value of some expression by defining the semantics of the expression itself.

These are the main design concepts behind the EVA language:

- EVA uses a simple format known as _S-expressions_ (or _Symbolic Expression_) as syntax to represent both code and
data (the same format used by Lisp programming languages).

> Example
> ```
> //EVA expression format:
> (<type> <op1> <op2> ... <opn>)
> ```

- Everything in EVA is an expression, including loops and conditional operators. 

> Definition
>
> An expression is or produces a value, while a statement performs an action which doesn't produce a value.

> Example
> ```
> //EVA while expression assignment:
> (set res (while (< i 10)
>                 (++ i)))
> ```

- EVA doesn't have an explicit `return` expression. The last evaluated expression will always be the result of the
operation.


- EVA implements static scopes.

> Definition
> 
> In static scope (also known as lexical scope), the scope of a variable is determined by the structure of the code at
> the time the code is written (_static time_). The location where a variable is declared within the source code
> determines where that variable is accessible.
> 
> In dynamic scope, the scope of a variable is determined at _runtime_, based on the call stack. When a variable is 
> referenced, the language runtime looks up the call stack to find the most recently executed instance of
> that variable.

- EVA supports First-class functions.

> Definition
> 
> A first class function is a function that can be assigned to variables, passed as argument, and returned as value.

-  All function in EVA are closures.

> Definition
> 
> A closure is a combination of a function and the lexical environment within which that function was declared.
> This environment includes any local variables that were in-scope at the time the closure was created.
> 
> When a function is created in a programming language that supports first-class functions (like JavaScript, Python,
> etc.), it "captures" the environment in which it was created. This means the function retains access to the
> variables that were in scope at the time it was created, even if it is executed outside that scope later on.

> Example
> ```
> //EVA closure definition:
> (def createCounter ()
>   (begin
>   (var i 0)
>   (lambda () (++ i))))
> 
> //EVA closure assignment:
> (var count (createCounter))
> 
> //EVA closure calls:
> (count) //1
> (count) //2
> ```

- EVA allows to organize the code and group it in sharable entities by using namespaces and modules.


- EVA supports both imperative and functional programming paradigms. For the imperative paradigm, EVA supports also OOP,
with both class-based and prototype-based models.

## EVA expressions
//todo

## AST format

The AST format used as input for the EVA Interpreter is a simplified array version of the standard json representation.

To better understand, let's consider the following source code:

```javascript 
total = current + 150;
```

The corresponding _AST_ can be represented as the following json:

```
// AST
Assignment
├── total
└── Addition
    ├── current
    └── 150
```

```json
{
  "type": "Assignment",
  "left": {
    "type": "Identifier",
    "value": "total"
  },
  "right": {
    "type": "Addition",
    "left": {
      "type": "Identifier",
      "value": "current"
    },
    "right": {
      "type": "Literal",
      "value": 150
    }
  }
}
```

However, a more convenient and concise representation can be obtained following these steps:

1. Instead of using the actual property names for the expression parts, it is possible to use numeric indexes:

```json
{
  "0": "Assignment",
  "1": {
    "0": "Identifier",
    "1": "total"
  },
  "2": {
    "0": "Addition",
    "1": {
      "0": "Identifier",
      "1": "current"
    },
    "2": {
      "0": "Literal",
      "1": 150
    }
  }
}
```
2. Since we are using numeric indexes, it is possible to convert objects into arrays:

```javascript
[
  "Assignment",
  [
    "Identifier",
    "total"
  ],
  [
    "Addition",
    [
      "Identifier",
      "current"
    ],
    [
      "Literal",
      150
    ]
  ]
]
```
3. Instead of using the operators full name, it is possible to use more concise symbols:

```javascript
[
  "set",
  [
    "Identifier",
    "total"
  ],
  [
    "+",
    [
      "Identifier",
      "current"
    ],
    [
      "Literal",
      150
    ]
  ]
]
```
4. For _Identifier_ expressions, it is possible to imply the _type_ and provide only the _value_, as it cannot be
mistaken for anything else:

```javascript
[
  "set",
  "total",
  [
    "+",
    "current",
    [
      "Literal",
      150
    ]
  ]
]
```

5. For the same reason, it is also possible to imply the _type_ and provide only the _value_ for _Literal_ expressions,
obtaining the definitive format:

```javascript
["set", "total", ["+", "current", 150]]
```

> Note
> 
> The main advantage of this simplified _AST_ format is that it directly corresponds to javascript arrays or python
> lists.
> 
> The format is also very similar to the _S-expressions_ used for the EVA language syntax, allowing a substantial
> simplification of the parsing process.
