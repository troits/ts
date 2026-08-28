interface CacheEntry<V> {
  readonly value: V;
  readonly expiresAt: number;
}

export class TTLCache<K, V> implements Iterable<CacheEntry<V>[]> {
  [Symbol.iterator](): Iterator<CacheEntry<V>[], any, any> {
    throw new Error("Method not implemented.");
  }
  private readonly storage = new Map<K, CacheEntry<V>>();

  public get(key: K): V | undefined {
    return this.checkAndGet(key);
  }

  public set(key: K, value: V, ttl: number) {
    this.storage.set(key, { value, expiresAt: Date.now() + ttl });
  }

  public has(key: K): boolean {
    return !!this.checkAndGet(key);
  }

  public clear(): void {
    this.storage.clear();
  }

  public size(): number {
    const now = Date.now();
    return Array.from(this.storage.values()).filter((entry) => entry.expiresAt < now).length;
  }

  // public *[Symbol.iterator](): Iterator<[K, V]> {
  //   let index = 0;
  //   return {
  //     next: () => {
  //       if (index < this.storage.size) {
  //         return { value: this.storage.entries[index++], done: false };
  //       } else {
  //         return { value: undefined, done: true };
  //       }
  //     },
  //   };
  // }

  private checkAndGet(key: K): V | undefined {
    const entry = this.storage.get(key);
    if (!entry) {
      return undefined;
    }

    if (entry.expiresAt < Date.now()) {
      this.storage.delete(key);
      return undefined;
    }

    return entry.value;
  }
}
