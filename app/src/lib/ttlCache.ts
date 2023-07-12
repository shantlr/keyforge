import { LRUCache } from 'lru-cache';

export const createSingleValueCache = <Value extends {}>(
  resolve: () => Promise<Awaited<Value>>,
  opt?: Omit<LRUCache.Options<'', Value, unknown>, 'fetchMethod'>
) => {
  const lru = new LRUCache<'', Value>({
    ttl: 60 * 60 * 1000,
    max: 1,
    ignoreFetchAbort: true,
    allowStaleOnFetchAbort: true,
    ...(opt || null),
    async fetchMethod() {
      return await resolve();
    },
  });

  return {
    current() {
      return lru.get('');
    },
    async get() {
      const res = lru.get('');
      if (res !== undefined) {
        return res;
      }

      return (await lru.fetch('')) as Value;
    },
    async set(value: Awaited<Value>) {
      lru.set('', value);
      return value;
    },
  };
};

export const createCache = <Key extends string | number | {}, Value extends {}>(
  resolve: (key: Key) => Promise<Awaited<Value>>,
  opt?: Omit<LRUCache.Options<Key, Value, unknown>, 'fetchMethod'>
) => {
  const lru = new LRUCache<Key, Value>({
    ttl: 60 * 60 * 1000,
    max: 10,
    ignoreFetchAbort: true,
    allowStaleOnFetchAbort: true,
    ...(opt || null),
    async fetchMethod(key) {
      return await resolve(key);
    },
  });

  return {
    current(key: Key) {
      return lru.get(key);
    },
    async get(key: Key) {
      const res = lru.get(key);
      if (res !== undefined) {
        return res;
      }

      return (await lru.fetch(key)) as Value;
    },
    async set(key: Key, value: Awaited<Value>) {
      lru.set(key, value);
      return value;
    },
  };
};
