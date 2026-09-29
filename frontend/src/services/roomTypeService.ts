import roomTypesData from '../data/mock/roomTypes.json';
import type { RoomType } from '@/types/auth.types';

class RoomTypeService {
  private data: RoomType[] = [...roomTypesData as RoomType[]];

  getAll(): RoomType[] {
    return this.data.map((item) => ({ ...item }));
  }

  getById(id: string): RoomType | undefined {
    return this.data.find((item) => item.id === id);
  }

  create(data: Omit<RoomType, 'id' | 'createdAt' | 'updatedAt'>): RoomType {
    const now = new Date().toISOString();
    const newItem: RoomType = {
      ...data,
      id: `room-type-${String(this.data.length + 1).padStart(3, '0')}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.push(newItem);
    return { ...newItem };
  }

  update(id: string, updates: Partial<RoomType>): RoomType | null {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.data[index] = { ...this.data[index], ...updates, updatedAt: new Date().toISOString() };
    return { ...this.data[index] };
  }

  delete(id: string): boolean {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.data.splice(index, 1);
    return true;
  }

  toggleStatus(id: string): boolean {
    const item = this.data.find((i) => i.id === id);
    if (!item) return false;
    item.status = item.status === 'active' ? 'inactive' : 'active';
    item.updatedAt = new Date().toISOString();
    return true;
  }
}

export const roomTypeService = new RoomTypeService();
export default roomTypeService;
