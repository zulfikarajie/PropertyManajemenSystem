import reservationsData from '../data/mock/reservations.json';
import reservationRoomsData from '../data/mock/reservationRooms.json';
import type { Reservation, ReservationRoom } from '@/types/auth.types';

class ReservationService {
  private reservations: Reservation[] = [...reservationsData as Reservation[]];
  private reservationRooms: ReservationRoom[] = [...reservationRoomsData as ReservationRoom[]];

  getAll(): Reservation[] {
    return this.reservations.map((item) => ({ ...item }));
  }

  getById(id: string): Reservation | undefined {
    return this.reservations.find((item) => item.id === id);
  }

  getByStatus(status: Reservation['status']): Reservation[] {
    return this.reservations.filter((item) => item.status === status);
  }

  getByDateRange(checkIn: Date, checkOut: Date): Reservation[] {
    return this.reservations.filter((item) => {
      const ci = new Date(item.checkInDate);
      const co = new Date(item.checkOutDate);
      return ci <= checkOut && co >= checkIn;
    });
  }

  getReservationRooms(reservationId: string): ReservationRoom[] {
    return this.reservationRooms.filter((item) => item.reservationId === reservationId);
  }

  getReservationWithRooms(reservationId: string): (Reservation & { rooms: ReservationRoom[] }) | undefined {
    const reservation = this.reservations.find((item) => item.id === reservationId);
    if (!reservation) return undefined;
    const rooms = this.getReservationRooms(reservationId);
    return { ...reservation, rooms };
  }

  create(data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>, rooms: Omit<ReservationRoom, 'id' | 'createdAt'>[]): Reservation {
    const now = new Date().toISOString();
    const newReservation: Reservation = {
      ...data,
      id: `res-${String(this.reservations.length + 1).padStart(3, '0')}`,
      createdAt: now,
      updatedAt: now,
    };
    this.reservations.push(newReservation);

    rooms.forEach((room) => {
      const newRoom: ReservationRoom = {
        ...room,
        reservationId: room.reservationId && room.reservationId !== 'pending' ? room.reservationId : newReservation.id,
        id: `res-room-${String(this.reservationRooms.length + 1).padStart(3, '0')}`,
        createdAt: now,
      };
      this.reservationRooms.push(newRoom);
    });

    return { ...newReservation };
  }

  update(id: string, updates: Partial<Reservation>): Reservation | null {
    const index = this.reservations.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.reservations[index] = { ...this.reservations[index], ...updates, updatedAt: new Date().toISOString() };
    return { ...this.reservations[index] };
  }

  cancel(id: string): boolean {
    const index = this.reservations.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.reservations[index].status = 'cancelled';
    this.reservations[index].totalAmount = 0;
    this.reservations[index].updatedAt = new Date().toISOString();
    return true;
  }

  checkIn(id: string): boolean {
    const reservation = this.reservations.find((item) => item.id === id);
    if (!reservation || reservation.status !== 'reserved') return false;
    reservation.status = 'checked-in';
    reservation.updatedAt = new Date().toISOString();
    return true;
  }

  checkOut(id: string): boolean {
    const reservation = this.reservations.find((item) => item.id === id);
    if (!reservation || reservation.status !== 'checked-in') return false;
    reservation.status = 'checked-out';
    reservation.updatedAt = new Date().toISOString();
    return true;
  }

  getAllReservationRooms(): ReservationRoom[] {
    return this.reservationRooms.map((item) => ({ ...item }));
  }

  getRoomsByReservationId(reservationId: string): ReservationRoom[] {
    return this.reservationRooms.filter((item) => item.reservationId === reservationId);
  }
}

export const reservationService = new ReservationService();
export default reservationService;
