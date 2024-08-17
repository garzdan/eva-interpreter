module.exports = class ExecutionStack {
  constructor(stack = [], debug = false) {
    this.stack = stack;
    this.debug = debug;
  }

  push(name, env) {
    this.stack.push({
      name: (typeof name === 'string' ? name : 'anonymous'),
      env: env,
    });

    if (this.debug) {
      this.print();
    }

    return this.stack;
  }

  pop() {
    this.stack.pop();

    if (this.debug) {
      this.print();
    }

    return this.stack
  }

  print() {
    console.log(`execution stack`, `\n`);
    console.log(`---------------`, `\n\n`);

    this.stack.forEach((stackEntry) => {
      console.log(stackEntry, `\n\n`);
    });
  }
}