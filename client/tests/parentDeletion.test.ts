import { describe, expect, it, vi } from 'vitest';
import { deleteParentAccountAndLocalData } from '../src/services/parentDeletion';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, String(value)); }
}

describe('parent account deletion orchestration', () => {
  it('clears all NovaStars local data after server and media deletion succeed', async () => {
    const storage = new MemoryStorage();
    storage.setItem('novastars_parent_zone_v1', '{}');
    storage.setItem('novastars_space_state_v3', '{}');
    storage.setItem('another_app', 'keep');
    const result = await deleteParentAccountAndLocalData({ deleteRemote: vi.fn().mockResolvedValue({ success: true }), clearMedia: vi.fn().mockResolvedValue([]), storage });
    expect(result.remoteConfirmed).toBe(true);
    expect(result.warnings).toEqual([]);
    expect(storage.getItem('novastars_parent_zone_v1')).toBeNull();
    expect(storage.getItem('novastars_space_state_v3')).toBeNull();
    expect(storage.getItem('another_app')).toBe('keep');
  });

  it('still erases local state when the server response is lost', async () => {
    const storage = new MemoryStorage();
    storage.setItem('novastars_parent_zone_v1', '{}');
    const result = await deleteParentAccountAndLocalData({ deleteRemote: vi.fn().mockRejectedValue(new Error('network timeout')), clearMedia: vi.fn().mockResolvedValue([]), storage });
    expect(result.remoteConfirmed).toBe(false);
    expect(result.warnings[0]).toContain('chưa xác nhận');
    expect(storage.getItem('novastars_parent_zone_v1')).toBeNull();
  });

  it('clears local state even if physical media cleanup throws', async () => {
    const storage = new MemoryStorage();
    storage.setItem('novastars_parent_zone_v1', '{}');
    const result = await deleteParentAccountAndLocalData({ deleteRemote: vi.fn().mockResolvedValue({ success: true }), clearMedia: vi.fn().mockRejectedValue(new Error('filesystem error')), storage });
    expect(result.warnings).toContain('Không thể xác nhận đã xóa hết media local.');
    expect(storage.getItem('novastars_parent_zone_v1')).toBeNull();
  });
});
