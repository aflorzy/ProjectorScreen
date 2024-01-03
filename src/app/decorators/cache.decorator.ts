const cacheMap = new Map<string, any>();
// Cache 1 minute by default
export function Cache(ttl = 60000) {
  return function (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const cacheKey = `${propertyKey.toString()}:${JSON.stringify(args)}`;
      if (cacheMap.has(cacheKey)) {
        const cachedItem = cacheMap.get(cacheKey);
        if (ttl > 0 && Date.now() - cachedItem.timestamp > ttl) {
          cacheMap.delete(cacheKey);
        } else {
          return cachedItem.value;
        }
      }
      const result = originalMethod.apply(this, args);
      cacheMap.set(cacheKey, { value: result, timestamp: Date.now() });
      return result;
    };
  };
}
