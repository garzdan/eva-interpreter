const Environment = require("./Environment");

const GLOBAL_ENV = new Environment({
  null: null,
  true: true,
  false: false,
  version: '0.1',
});

function isNumber(exp) {
  return typeof exp === 'number';
}

function isString(exp) {
  return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

//variable names must be strings, starting with a letter and containing only alphanumeric characters plus the underscore symbol
function isVariableName(exp) {
  return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}

module.exports = class EvaInterpreter {
  //creates an Eva interpreter instance with the global environment
  constructor(globalEnv = GLOBAL_ENV) {
    this.globalEnv = globalEnv;
  }

  eval(exp, env = this.globalEnv) {
    //self-evaluating expressions:

    //number
    if (isNumber(exp)) {
      return exp;
    }

    //string (must be surrounded by double quotes)
    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    //--------------------------

    //math expressions:

    //sum
    if (exp[0] === "+") {
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }

    //subtraction
    if (exp[0] === "-") {
      return this.eval(exp[1], env) - this.eval(exp[2], env);
    }

    //multiplication
    if (exp[0] === "*") {
      return this.eval(exp[1], env) * this.eval(exp[2], env);
    }

    //division
    if (exp[0] === "/") {
      return this.eval(exp[1], env) / this.eval(exp[2], env);
    }

    //module
    if (exp[0] === "%") {
      return this.eval(exp[1], env) % this.eval(exp[2], env);
    }

    //--------------------------

    //comparison expressions:

    //greater
    if (exp[0] === '>') {
      return this.eval(exp[1], env) > this.eval(exp[2], env);
    }

    //greater or equal
    if (exp[0] === '>=') {
      return this.eval(exp[1], env) >= this.eval(exp[2], env);
    }

    //lesser
    if (exp[0] === '<') {
      return this.eval(exp[1], env) < this.eval(exp[2], env);
    }

    //lesser or equal
    if (exp[0] === '<=') {
      return this.eval(exp[1], env) <= this.eval(exp[2], env);
    }

    //equal
    if (exp[0] === '=') {
      return this.eval(exp[1], env) === this.eval(exp[2], env);
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

      return env.define(name, this.eval(value));
    }

    //assignment
    if (exp[0] === 'set') {
      const [_, name, value] = exp;

      return env.assign(name, this.eval(value, env));
    }

    //lookup
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    //--------------------------

    //conditional expressions:

    //if
    if (exp[0] === 'if') {
      const [_tag, condition, consequent, alternate] = exp;

      return this.eval(condition, env) ? this.eval(consequent, env) : this.eval(alternate, env);
    }

    //--------------------------

    // cycle expressions

    //while
    if (exp[0] === 'while') {
      const [_tag, condition, body] = exp;
      let result;

      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }

      return result;
    }

    //--------------------------


    throw `Unimplemented expression: ${JSON.stringify(exp)}`;
  }

  _evalBlock(block, env) {
    let result;

    const [_tag, ...expressions] = block;

    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });

    return result;
  }
}

//self-evaluating expression: expression that are returned right away, without further processing by the interpreter