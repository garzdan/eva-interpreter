const ExecutionStack = require('./../../src/ExecutionStack');

test('pushed environment is stored on top of the execution stack', () => {
  const executionStack = new ExecutionStack();

  expect(executionStack.stack.length).toBe(0);

  executionStack.push('foo', {});

  expect(executionStack.stack.length).toBe(1);
  expect(executionStack.stack[0]).toEqual({name: 'foo', env: {}});
});

test('popped environment is removed from the top of the execution stack', () => {
  const executionStack = new ExecutionStack([{name: 'env1', env: {}}]);
  executionStack.push('env2', {});

  expect(executionStack.stack.length).toBe(2);

  executionStack.pop();

  expect(executionStack.stack.length).toBe(1);
  expect(executionStack.stack[0]).toEqual({name: 'env1', env: {}});
});

test('pushed environment name is set to anonymous if the provided name is not a valid string', () => {
  const executionStack = new ExecutionStack();
  executionStack.push({}, {});

  expect(executionStack.stack[0]).toEqual({name: 'anonymous', env: {}});
});

test('execution stack is printed after every push/pop if debug mode is enabled', () => {
  const executionStack = new ExecutionStack([], true);

  console.log = jest.fn();

  executionStack.push('env1', {});

  expect(console.log.mock.calls).toHaveLength(3);

  executionStack.pop();

  expect(console.log.mock.calls).toHaveLength(5);
});
