module.exports = class Environment {
  //creates an environment with the given record
  constructor(record = {}, parent = null) {
    this.record = record;
    this.parent = parent;
  }

  //stores a variable with the given name and value
  define(name, value) {
    this.record[name] = value;

    return value;
  }

  //update the value of an existing variable
  assign(name, value) {
    this._resolve(name).record[name] = value;

    return value;
  }

  //return the value of a variable if it's define, otherwise throws an error if the variable is not defined
  lookup(name) {
    return this._resolve(name).record[name];
  }

  /**
   * return specific environment in which a variable is defined, or throws if the variable is not defined in any
   * environment of the chain
   */

  _resolve(name) {
    if (this.record.hasOwnProperty(name)) {
      return this;
    }

    if (this.parent === null) {
      throw new ReferenceError(`Variable ${name} is not defined.`);
    }

    return this.parent._resolve(name);
  }
}