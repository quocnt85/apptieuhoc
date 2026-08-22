export const clearNovaStarsLocalData = (storage: Storage = localStorage): string[] => {
  const removed: string[] = [];
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith('novastars_')) keys.push(key);
  }
  for (const key of keys) {
    storage.removeItem(key);
    removed.push(key);
  }
  return removed.sort();
};
