import activitiesData from '../data/mock/activities.json';
import type { Activity } from '@/types/auth.types';

class ActivityService {
  private data: Activity[] = [...activitiesData as Activity[]];

  getAll(): Activity[] {
    return this.data.map((item) => ({ ...item }));
  }

  getById(id: string): Activity | undefined {
    return this.data.find((item) => item.id === id);
  }

  getByCategory(category: string): Activity[] {
    return this.data.filter((item) => item.category === category);
  }

  getByUser(userId: string): Activity[] {
    return this.data.filter((item) => item.userId === userId);
  }

  getByDateRange(startDate: string, endDate: string): Activity[] {
    return this.data.filter((item) => {
      const date = new Date(item.createdAt);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
  }

  getRecent(limit = 20): Activity[] {
    return this.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
  }

  create(data: Omit<Activity, 'id' | 'createdAt'>): Activity {
    const now = new Date().toISOString();
    const newItem: Activity = {
      ...data,
      id: `act-${String(this.data.length + 1).padStart(3, '0')}`,
      createdAt: now,
    };
    this.data.push(newItem);
    return { ...newItem };
  }
}

export const activityService = new ActivityService();
export default activityService;
