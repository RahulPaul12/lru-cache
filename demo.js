const LRUCache = require("./lru");

function log(label, result) {
  console.log(`${label} -> ${result}`);
}

console.log("=== LRU Cache Demo (capacity = 2) ===\n");

const cache = new LRUCache(2);

console.log('cache.put("A", 10)');
cache.put("A", 10);
console.log("  state (LRU -> MRU):", cache.keysByRecency());

console.log('cache.put("B", 20)');
cache.put("B", 20);
console.log("  state (LRU -> MRU):", cache.keysByRecency());

log('cache.get("A")', cache.get("A")); // 10, A becomes most recently used
console.log("  state (LRU -> MRU):", cache.keysByRecency());

console.log('cache.put("C", 30)  // capacity exceeded -> evicts LRU ("B")');
cache.put("C", 30);
console.log("  state (LRU -> MRU):", cache.keysByRecency());

log('cache.get("B")', cache.get("B")); // -1, B was evicted
log('cache.get("C")', cache.get("C")); // 30
log('cache.get("A")', cache.get("A")); // 10

console.log("\n=== Extra checks ===\n");

console.log('cache.put("A", 999)  // update existing key');
cache.put("A", 999);
log('cache.get("A")', cache.get("A")); // 999
console.log("  state (LRU -> MRU):", cache.keysByRecency());

console.log('cache.put("D", 40)  // capacity exceeded -> evicts LRU ("C")');
cache.put("D", 40);
console.log("  state (LRU -> MRU):", cache.keysByRecency());

log('cache.get("C")', cache.get("C")); // -1, C was evicted
log('cache.get("A")', cache.get("A")); // 999
log('cache.get("D")', cache.get("D")); // 40

console.log('\ncache.get("missing")', "->", cache.get("missing")); // -1, never existed

console.log("\n=== Invalid capacity check ===");
try {
  new LRUCache(0);
} catch (err) {
  console.log("new LRUCache(0) threw as expected:", err.message);
}
