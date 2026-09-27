# LRU Cache (JavaScript)

A Least Recently Used (LRU) cache implemented in plain Node.js, with `get(key)`
and `put(key, value)` running in **O(1) average time**.

## Files

| File | Purpose |
|---|---|
| `lru.js` | The `LRUCache` class implementation |
| `demo.js` | Runnable demo reproducing the example from the spec, plus extra scenarios |
| `test.js` | Assertion-based sanity tests |
| `lru_output_screenshot.png` | Screenshot of real output from running `demo.js` and `test.js` |

## Data structure used, and why

The cache is built on a single JavaScript `Map`:

```js
this.map = new Map(); // key -> value
```

A `Map` is the right tool here for two reasons:

1. **O(1) average-time operations.** Like a plain object/hash table, `Map.get`,
   `Map.set`, `Map.has`, and `Map.delete` are all O(1) on average, because they
   are backed by a hash table internally.
2. **It preserves insertion order**, and — critically — **re-inserting an
   existing key moves it to the end of that order**. This is exactly the
   behavior a classic LRU cache needs from its ordering structure, and it's
   built into the `Map` API for free.

This means we don't need to hand-roll a separate doubly linked list next to a
hash map (the "textbook" LRU implementation). The `Map`'s internal linked
hash-table structure already gives us that ordering, so:

- The **front** of the map's iteration order (`map.keys().next().value`) is
  always the **least recently used** entry.
- The **back** of the map's iteration order is always the **most recently
  used** entry.

## How LRU ordering is maintained

- **On `get(key)`:** if the key exists, we `delete` it and `set` it again with
  its existing value. This doesn't change the value, but it moves the key to
  the most-recently-used (end) position in the map's iteration order.
- **On `put(key, value)`:**
  - If the key already exists, we `delete` it first, so that re-adding it
    below places it at the most-recently-used end (rather than leaving it at
    its old position).
  - If the key is new **and** the cache is already at capacity, we evict the
    least recently used entry — the first key returned by
    `map.keys().next().value` — before inserting the new one.
  - Finally, we `set(key, value)`, which places the (possibly new) key at the
    most-recently-used end.
- **On a cache miss (`get` on a nonexistent key):** we simply return `-1`
  without touching the map, since a miss shouldn't affect recency ordering.

## Time complexity

| Operation | Complexity | Why |
|---|---|---|
| `get(key)` | O(1) average | `Map.has`/`get`/`delete`/`set` are all O(1) average (hash table) |
| `put(key, value)` | O(1) average | Same map operations; eviction reads only the first key via the iterator, which is O(1) |

(As with any hash-table-based structure, this is *average-case* O(1); JS engines
may occasionally resize/rehash internally, but this is amortized away.)

## Space complexity

**O(capacity)** — the map never holds more than `capacity` key/value pairs,
since every `put` that would exceed capacity first evicts one entry.

## How to run

Requires Node.js (any reasonably recent version, tested on v22).

```bash
# Run the interactive demo (matches the example in the spec, plus more)
node demo.js

# Run the test suite
node test.js
```

Expected `test.js` output:

```
All tests passed!
```

See `lru_output_screenshot.png` for a screenshot of actual terminal output
from running both scripts.

## Usage example

```js
const LRUCache = require("./lru");

const cache = new LRUCache(2);
cache.put("A", 10);
cache.put("B", 20);
cache.get("A");        // -> 10  (A is now most recently used)
cache.put("C", 30);    // capacity exceeded -> evicts "B" (least recently used)
cache.get("B");        // -> -1  (evicted)
cache.get("C");        // -> 30
cache.get("A");        // -> 10
```
