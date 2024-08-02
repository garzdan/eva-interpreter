function isNumber(exp) {
  return typeof exp === 'number';
}

function isString(exp) {
  return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

module.exports = class EvaInterpreter {
  eval(exp) {
    //self-evaluating expressions

    //number
    if (isNumber(exp)) {
      return exp;
    }

    //string (must be surrounded by double quotes)
    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    //--------------------------

    //math expressions

    //sum
    if(exp[0] === "+") {
      return this.eval(exp[1]) + this.eval(exp[2]);
    }

    //subtraction
    if(exp[0] === "-") {
      return this.eval(exp[1]) - this.eval(exp[2]);
    }

    //multiplication
    if(exp[0] === "*") {
      return this.eval(exp[1]) * this.eval(exp[2]);
    }

    //division
    if(exp[0] === "/") {
      return this.eval(exp[1]) / this.eval(exp[2]);
    }

    //module
    if(exp[0] === "%") {
      return this.eval(exp[1]) % this.eval(exp[2]);
    }

    //--------------------------

    throw 'Unimplemented';
  }
}

//self-evaluating expression: expression that are returned right away, without further processing by the interpreter