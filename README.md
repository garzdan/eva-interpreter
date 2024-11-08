# EVA Interpreter

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

### Self-evaluating expressions

Self-evaluating expressions in EVA include Numbers and Strings, which return directly their value without further evaluation:

- Numbers include signed and unsigned `integers` and `floats` (in both standard and exponential notation), `NaN` and `Infinity`
> Example
> ```
> (5)           //5
> (-4)          //-4 
> (7.4)         //7.4
> (-3.2)        //-3.2
> (NaN)         //NaN
> (Infinity)    //Infinity
> (1.23e5)      //1.23e5 
>```

- Strings are any characters combination passed in double quotes
> Example
> ```
> ("foo")           //foo
> ("bar")           //bar
> ("hello world!")  //hello world!
>```


### Math expressions

The math operations supported by EVA are the following:

- Sum: `(+ <op1> op2>)`
- Subtraction: `(- <op1> <op2)`
- Multiplication: `(* <op1> <op2>)`
- Division: `(/ <op1> <op2>)`
- Module: `(% <op1> <op2>)`

For each operator, arguments can be Numbers, Strings or other math expressions (evaluated recursively). Math expression 
return the result of the operation as value.

> Note
> 
> To increase the performances of these heavily used operators, the EVa interpreter implment them in global scope 
> as built-in native JavaScript functions.

> Example
> ```
> (+ 3 5)             //8
> (- 7.5 4.3)         //3.2
> (* 3 3)             //9
> (/ 6 3)             //2
> (% 5 2)             //1
> (- (+ 3 7) (* 4 2)) //2
>```

### Comparison expressions

The comparison operators supported by EVA are the following:
- grater: `(> <op1> <op2>)`
- greater or equal: `(>= <op1> <op2>)`
- lesser: `(< <op1> <op2>)`
- lesser or equal: `(<= <op1> <op2>)`
- equal: `(= <op1> <op2>)`

> Note
>
> To increase the performances of these heavily used operators, they are implemented in the global scope as built-in
> native JavaScript functions in the EVA interpreter.

> Example
> ```
> (> 3 5)       //true
> (>= 5 5)      //true
> (< 0 10)      //true
> (<= 3 3)      //true
> (= 15 15)     //true
> ```

### Variable expressions

The variable expressions supported by EVA are the following:

- declaration: `(var <name> <value>)`

declares a variable in current scope. The expression returns the value of the declared variable.

> Example
> ```
> (var foo 10)  //10
>```

- assignment: `(set <name> <value>)` 

assigns a value to a variable already defined in the environment (scope) chain.
The expression returns the new value assigned to the variable, or an error if the variable does not exist.

> Example
> ```
> (set foo 20)  //20
>```

- look-up: `(<name>)`

look-up a variable value by traversing the environments (scope) chain to resolve its identifier.
The expression returns tha value of the variable, or an error if the variable is not defined.

> Example
> ```
> (set foo 20)
> foo  //20
>```

- increase: `(++ <name>)`
increase by 1 the current variable's value

> Example
> 
> ```
> (var i 0)
> (print i) //0
> (++ i)
> (print i) //1 
> ```

- decrease: `(-- <name>)`

decrease by 1 the current variable's value

> Example
>
> ```
> (var i 5)
> (print i) //5
> (-- i)
> (print i) //4 
>

### Block expression

`(begin <exp1> <exp2> ... <expn>)`

The block expression allows you to group expressions and evaluate them in their own scope (block environment).

> Example
> 
> ```
> (var x 10)
> (print x)     //10
> 
> (begin
>   (var x 20)
>   (print x)   //20 (variable shadowing)
> )
> 
> (print x)     //10
> ```

### Branch expressions

The branch expressions supported by EVA are the following:

- if: `(if <condition> <consequent> <alternate>)`

> Example
> 
> ```
> (var x 10)
> (if (x > 5) 
>   (set x 3)
>   (set x 14)
> )
> x //14
> ```

- switch: `(switch (<case1> <block1>) (<case2> <block2>) ... (else <blockn>))`

> Example
> 
> ```
> (var x 5)
> (switch
>   ((x > 5) (print "foo"))
>   ((x = 5) (print "bar"))
>   (else (print "end")
> ) //"bar"
> ```

### Loop expressions

The loop expressions supported by EVA are the following:

- while: `(while <condition> <block>)`

> Example
> 
> ```
> (var x 0)
> (while (x < 5) (begin
>   (set x (+ x 1))
>   x
> ))
> ```

- for: `(for <init> <condition> <modifier> <body>)`

> Example
> 
> ```
> (for (var i 0) (< i 10) (++ i)
>   (print i)
> ) 
> ```

### Function expressions

In EVA all function are closures, meaning that all functions store a reference to the scope in which they were defined,
and therefore they can access all the variable defined in that scope chain.

The function expressions supported by EVA are the following:

- declaration: `(def <name> <params> <body>)`

> Example
> ```
> (def sum (x y) (+ x y))
> ```

- call: `(name <param1> <param2> ... <paramn>)`

> Example
> 
> ```
> (sum 1 2) //3
> ```

- lambda: `(lambda <params> <body>)`

define an anonymous function.

> Example
> ```
> (var sum (lambda (x y) (+ x y)))
> (sum 3 5) //8
> ```

- _Immediately-Invoked Lambda Expression (IILE)_: `((lambda <params> <body>) <param1> <param2> ... <paramn>)`

define and immediately invoke an anonymous function.

> Example
> ```
> ((lambda (x y) (+ x y)) 3 7) //10
> ```

### Class expressions

In EVA classes are named environments that can be instantiated. A class instance (object) is a new environment which 
has the class environment as parent.

A class can inherit from another class: in this case, the child class store a reference to the parent class environment.

The class expressions supported by EVA are the following:

- definition: `(class <name> <parent> <body>)`
- property set: `(set (prop <instance> <name>) <value>)`
- property read: `(prop <instance> <name>)`
- instantiation: `(new <name> <params>)`
- access to parent's class environment: `(super <childName>)`

> Example
> ```
> (class Point3D Point
>   (begin
>     (def constructor (this x y z)
>       (begin
>         ((prop (super Point3D) constructor) this x y)
>         (set (prop this z) z)  
>       )
>     )
>     (def calc (this)
>       (begin
>         (+ ((prop (super Point3D) calc) this) (prop this z))
>       )
>     ) 
>   )
> )
> (var p3d (new Point3D 1 2 3))
> ((prop p3d calc) p3d) //6
> ```

### Module expressions
In EVA modules are named environment which can be defined in dedicated files and imported into the global environment. 

The module expressions supported by EVA are the following:

- definition: `(module <name> <body>)`
- import: `(import <name>)`

> Example
> 
> ```
> //file Math.eva
> (module Math
>   (begin
>     (def square (x)
>       (* x x)
>     )
>     (var MAX_VALUE 10000) 
>   )
> )
> 
> //main file
> (import Math)
> ((prop Math square) 2) //4
> ```

## Environments

An environment is a storage structure used to implement scopes, which acts as a repository of all variables and
functions defined in a scope. Every programming language has at least a global environment, which exists prior to code
execution and contains some global declarations.

Typically, the environment structure consists of two parts:
- **Environment Record**: it's the actual storage, usually just a key/value map from variable name to its value.
- **Reference to Parent Environment** (optional): environments may inherit other environments. For example, the local
scope of a function may access variables defined in its outer scope. To do so, the function environment needs to keep a
reference to its outer scope environment.

The EVA's Environment interface defines three main operations:
- **Storing of a variable in the Environment Record** (used to implement variable declaration)
- **Lookup of the value of a variable stored in the Environment Record** (used to implement variable lookup)
- 

Eva Interpreter's environment expects a variable name to start with a letter followed by alphanumeric characters or the
_ symbol. Its global environment defines out of the box the following variables:
- `null`
- `true`
- `false`
- `version`

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
