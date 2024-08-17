const Environment = require("./Environment");
const ExecutionStack = require("./ExecutionStack");
const Transformer = require('./transformer/Transformer');

//default global environment
const GLOBAL_ENV = new Environment({
  //global variables
  null: null,
  true: true,
  false: false,
  version: '0.1',
  //-------------------------
  //math operators:
  '+'(op1, op2) {
    return op1 + op2;
  },
  '-'(op1, op2 = null) {
    return op2 === null ? -op1 : op1 - op2;
  },
  '*'(op1, op2) {
    return op1 * op2;
  },
  '/'(op1, op2) {
    return op1 / op2;
  },
  '%'(op1, op2) {
    return op1 % op2
  },
  //-------------------------
  //comparison operators:
  '='(op1, op2) {
    return op1 === op2;
  },
  '>'(op1, op2) {
    return op1 > op2;
  },
  '>='(op1, op2){
    return op1 >= op2;
  },
  '<'(op1, op2) {
    return op1 < op2;
  },
  '<='(op1, op2) {
    return op1 <= op2;
  },
  //-------------------------
  //native functions:
  print(output) {
    console.log(output);
  }
  //
});

module.exports = class EvaInterpreter {
  //creates an Eva interpreter instance with the global environment
  constructor(
    globalEnv = GLOBAL_ENV,
    transformer = new Transformer(),
    executionStack = new ExecutionStack(),
  ) {
    this._globalEnv = globalEnv;
    this._transformer = transformer;
    this._executionStack = executionStack;

    this._executionStack.push('global', this._globalEnv);
  }

  eval(exp, env = this._globalEnv) {
    //self-evaluating expressions:

    //number
    if (this._isNumber(exp)) {
      return exp;
    }

    //string (must be surrounded by double quotes)
    if (this._isString(exp)) {
      return exp.slice(1, -1);
    }

    //--------------------------
    // block expression:

    //begin
    if (exp[0] === 'begin') {
      const blockEnv = new Environment({}, env);

      return this._evalBlock(exp, blockEnv);
    }

    //--------------------------
    //variable expressions:

    //declaration
    if (exp[0] === 'var') {
      const [_, name, value] = exp;

      return env.define(name, this.eval(value, env));
    }

    //assignment
    if (exp[0] === 'set') {
      const [_, name, value] = exp;

      return env.assign(name, this.eval(value, env));
    }

    //lookup
    if (this._isVariableName(exp)) {
      return env.lookup(exp);
    }

    //--------------------------
    //conditional expressions:

    //if
    if (exp[0] === 'if') {
      const [_tag, condition, consequent, alternate] = exp;

      return this.eval(condition, env) ? this.eval(consequent, env) : this.eval(alternate, env);
    }

    //switch
    if (exp[0] === 'switch') {
      const ifExp = this._transformer.transformSwitchToIf(exp);

      return this.eval(ifExp, env);
    }

    //--------------------------
    // cycle expressions:

    //while
    if (exp[0] === 'while') {
      const [_tag, condition, body] = exp;
      let result;

      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }

      return result;
    }

    //for
    if (exp[0] === 'for') {
      const whileExp = this._transformer.transformForToWhile(exp);

      return this.eval(whileExp, env);
    }

    // increment/decrement expressions:

    //increment
    if (exp[0] === '++') {
      const setExp = this._transformer.transformIncToSet(exp);

      return this.eval(setExp, env);
    }

    //decrement
    if (exp[0] === '--') {
      const setExp = this._transformer.transformDecToSet(exp);

      return this.eval(setExp, env);
    }
    //--------------------------

    // function expressions:

    /**
     * declaration
     * (def x (y) (* 2 y))
     * [syntactic sugar for `(var x (lambda (y) (* 2 y)))`]
     */

    if (exp[0] === 'def') {
      return this.eval(this._transformer.transformDefToLambda(exp), env);
    }

    //lambda function
    if (exp[0] === 'lambda') {
      const [_tag, params, body] = exp;

      return {
        params,
        body,
        env, //closure: captures the reference to the environment in which the function is defined
      }
    }

    //execution
    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);
      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      //built-in functions
      if (typeof fn === 'function') {
        return fn(...args);
      }

      //user-defined functions

      //create a new environment (a.k.a. activation environment)
      const activationRecord = {};

      fn.params.forEach((param, index) => {
        activationRecord[param] = args[index];
      });

      const activationEnv = new Environment(activationRecord, fn.env); //set the parent environment to the environment in which the function as been declared (static scope)
      //const activationEnv = new Environment(activationRecord, env); //set the parent environment to the environment in which the function as been called (dynamic scope)

      this._executionStack.push(exp[0], activationEnv);

      const result = this._evalBody(fn.body, activationEnv);

      this._executionStack.pop();

      return result;
    }

    //--------------------------

    throw `Unimplemented expression: ${JSON.stringify(exp)}`;
  }

  _isNumber(exp) {
    return typeof exp === 'number';
  }

  //variable names must be strings, starting with a letter and containing only alphanumeric characters plus the underscore symbol
  _isVariableName(exp) {
    return typeof exp === 'string' && /^[+\-*%/<>=a-zA-Z0-9_]*$/.test(exp);
  }

  _isString(exp) {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
  }

  _evalBlock(block, env) {
    let result;

    const [_tag, ...expressions] = block;

    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });

    return result;
  }

  _evalBody(body, env) {
    if (body[0] === 'begin') {
      return this._evalBlock(body, env);
    }

    return this.eval(body, env);
  }
}
