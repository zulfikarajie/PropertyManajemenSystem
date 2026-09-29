import roomsData from '../data/mock/rooms.json';
import type { Room } from '@/types/auth.types';

class RoomService {
  private data: Room[] = [...roomsData as Room[]];

  getAll(): Room[] {
    return this.data.map((item) => ({ ...item }));
  }

  getById(id: string): Room | undefined {
    return this.data.find((item) => item.id === id);
  }

  getByRoomTypeId(roomTypeId: string): Room[] {
    return this.data.filter((item) => item.roomTypeId === roomTypeId);
  }

  create(data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Room {
    const now = new Date().toISOString();
    const newItem: Room = {
      ...data,
      id: `room-${String(this.data.length + 1).padStart(3, '0')}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.push(newItem);
    return { ...newItem };
  }

  update(id: string, updates: Partial<Room>): Room | null {
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

export const roomService = new RoomService();
export default roomService;
