/**
 * LRUCache
 * ---------
 * A Least Recently Used (LRU) cache with O(1) average time complexity
 * for both get() and put().
 *
 * Implementation strategy:
 * We use a single JavaScript Map to store key -> value pairs.
 *
 * Why a Map works for O(1) LRU tracking (no separate doubly linked list needed):
 *   - A JS Map preserves insertion order of its keys.
 *   - Map.get/set/delete/has are all O(1) average time (hash table under the hood).
 *   - By DELETING and RE-INSERTING a key every time it is accessed (via get)
 *     or updated (via put), that key is moved to the "end" of the Map's
 *     iteration order, which we treat as the "most recently used" end.
 *   - The "front" of the Map's iteration order (the first key returned by
 *     .keys().next()) is therefore always the "least recently used" entry,
 *     which is what we evict when the cache exceeds capacity.
 *
 * This gives us the same O(1) guarantees as the classic
 * "HashMap + Doubly Linked List" approach, but with less code, because
 * the Map's internal linked-list-like ordering does the bookkeeping for us.
 */
class LRUCache {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error("Capacity must be a positive integer");
    }
    this.capacity = capacity;
    this.map = new Map(); // insertion order == recency order (oldest first)
  }

  /**
   * Returns the value for `key` if present, otherwise -1.
   * A successful get marks the key as most recently used.
   */
  get(key) {
    if (!this.map.has(key)) {
      return -1;
    }
    const value = this.map.get(key);
    // Move to most-recently-used position: delete + re-insert
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  /**
   * Inserts or updates the key/value pair.
   * Marks the key as most recently used.
   * Evicts the least recently used entry if capacity is exceeded.
   */
  put(key, value) {
    if (this.map.has(key)) {
      // Remove old entry so re-inserting places it at the MRU end
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // Evict least recently used = first key in iteration order
      const lruKey = this.map.keys().next().value;
      this.map.delete(lruKey);
    }
    this.map.set(key, value);
  }

  // --- Helpers used by the demo / tests (not required by the spec) ---

  size() {
    return this.map.size;
  }

  has(key) {
    return this.map.has(key);
  }

  // Returns keys ordered from least-recently-used to most-recently-used
  keysByRecency() {
    return [...this.map.keys()];
  }
}

module.exports = LRUCache;
