import { describe, expect, it } from 'vitest';
import { clearNovaStarsLocalData } from '../src/services/parentLocalData';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, String(value)); }
}

describe('Parent Zone local deletion', () => {
  it('removes all NovaStars keys without deleting unrelated app data', () => {
    const storage = new MemoryStorage();
    storage.setItem('novastars_parent_zone_v1', '{}');
    storage.setItem('novastars_space_state_v2', '{}');
    storage.setItem('another_app', 'keep');

    expect(clearNovaStarsLocalData(storage)).toEqual(['novastars_parent_zone_v1', 'novastars_space_state_v2']);
    expect(storage.getItem('novastars_parent_zone_v1')).toBeNull();
    expect(storage.getItem('novastars_space_state_v2')).toBeNull();
    expect(storage.getItem('another_app')).toBe('keep');
    expect(clearNovaStarsLocalData(storage)).toEqual([]);
  });
});
