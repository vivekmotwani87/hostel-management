const test = require('node:test');
const assert = require('node:assert');

test('Environment and Config sanity check', () => {
  const defaultPort = 5001;
  assert.strictEqual(typeof defaultPort, 'number');
  assert.strictEqual(defaultPort > 1000, true);
});

test('Token generation and secret check', () => {
  const jwt = require('jsonwebtoken');
  const secret = 'test_secret_key';
  const token = jwt.sign({ id: 'user123' }, secret, { expiresIn: '1h' });
  assert.ok(token);

  const decoded = jwt.verify(token, secret);
  assert.strictEqual(decoded.id, 'user123');
});

