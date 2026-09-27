const assert = require("assert");
const LRUCache = require("./lru");

// Example from the spec
{
  const cache = new LRUCache(2);
  cache.put("A", 10);
  cache.put("B", 20);
  assert.strictEqual(cache.get("A"), 10);
  cache.put("C", 30); // evicts B
  assert.strictEqual(cache.get("B"), -1);
  assert.strictEqual(cache.get("C"), 30);
  assert.strictEqual(cache.get("A"), 10);
}

// Update existing key refreshes recency and value
{
  const cache = new LRUCache(2);
  cache.put("A", 1);
  cache.put("B", 2);
  cache.put("A", 100); // A updated, now MRU
  cache.put("C", 3); // evicts B (LRU), not A
  assert.strictEqual(cache.get("B"), -1);
  assert.strictEqual(cache.get("A"), 100);
  assert.strictEqual(cache.get("C"), 3);
}

// Missing key returns -1
{
  const cache = new LRUCache(1);
  assert.strictEqual(cache.get("nope"), -1);
}

// Invalid capacity throws
{
  assert.throws(() => new LRUCache(0));
  assert.throws(() => new LRUCache(-1));
  assert.throws(() => new LRUCache(1.5));
}

console.log("All tests passed!");
