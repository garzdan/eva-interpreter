function isNumber(exp) {
  return typeof exp === 'number';
}

function isString(exp) {
  return typeof exp === 'string' && exp[0] === '"' && exp[exp.length - 1] === '"';
}

module.exports = class EvaInterpreter {
  eval(exp) {
    //numbers
    if (isNumber(exp)) {
      return exp;
    }

    //strings (must be surrounded by double quotes)
    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    throw 'Unimplemented';
  }
}

//self-evaluating expression: expression that are returned right away, without further processing by the interpreter