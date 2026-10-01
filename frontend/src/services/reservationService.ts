import { apiFetch } from './api';
import type { Reservation, ReservationRoom } from '@/types/auth.types';

export interface ApiNightlyRate {
  date: string;
  rate: number;
}

export interface ApiReservationPricing {
  mode: 'same' | 'different';
  nightlyRates: ApiNightlyRate[];
}

export interface ApiReservationPayment {
  type: 'no_dp' | 'dp';
  dpType: 'percentage' | 'fixed';
  dpPercentage?: number;
  dpFixedAmount?: number;
}

export interface ApiReservationCalc {
  nights: number;
  nightDates: string[];
  roomTotal: number;
  dpAmount: number;
  remainingBalance: number;
}

/** Backend reservation: header fields + embedded pricing/payment/calc/rooms. */
export interface ApiReservation extends Reservation {
  pricing: ApiReservationPricing;
  payment: ApiReservationPayment;
  calc: ApiReservationCalc;
  rooms?: ReservationRoom[];
}

export interface ReservationRoomInput {
  roomId: string;
  roomNumber: string;
  roomTypeName?: string;
}

export interface ReservationPricingInput {
  mode: 'same' | 'different';
  nightlyRates: ApiNightlyRate[];
  paymentType: 'no_dp' | 'dp';
  dpType: 'percentage' | 'fixed';
  dpPercentage?: number;
  dpFixedAmount?: number;
}

export interface CreateReservationPayload {
  guestName: string;
  source: string;
  checkInDate: string;
  checkOutDate: string;
  notes?: string;
  rooms: ReservationRoomInput[];
  pricing: ReservationPricingInput;
}

export type UpdateReservationPayload = Partial<CreateReservationPayload>;

interface ListResponse {
  data: ApiReservation[];
  pagination: { page: number; pageSize: number; total: number };
}

/**
 * Reservation client backed by the real API (`/api/reservations`).
 * `getAll` returns the full embedded shape (rooms/pricing/calc included);
 * filter helpers keep their previous names for call-site compatibility.
 */
class ReservationService {
  async getAll(): Promise<ApiReservation[]> {
    const json = await apiFetch<ListResponse>('/api/reservations?page=1&pageSize=100');
    return json.data;
  }

  async getById(id: string): Promise<Reservation | undefined> {
    try {
      const json = await apiFetch<{ data: ApiReservation }>(`/api/reservations/${encodeURIComponent(id)}`);
      return json.data;
    } catch {
      return undefined;
    }
  }

  async getFullById(id: string): Promise<ApiReservation | undefined> {
    try {
      const json = await apiFetch<{ data: ApiReservation }>(`/api/reservations/${encodeURIComponent(id)}`);
      return json.data;
    } catch {
      return undefined;
    }
  }

  async getByStatus(status: Reservation['status']): Promise<Reservation[]> {
    const all = await this.getAll();
    return all.filter((item) => item.status === status);
  }

  async getByDateRange(checkIn: Date, checkOut: Date): Promise<Reservation[]> {
    const all = await this.getAll();
    return all.filter((item) => {
      const ci = new Date(item.checkInDate);
      const co = new Date(item.checkOutDate);
      return ci <= checkOut && co >= checkIn;
    });
  }

  async getReservationRooms(reservationId: string): Promise<ReservationRoom[]> {
    const full = await this.getFullById(reservationId);
    return full?.rooms ?? [];
  }

  async getReservationWithRooms(reservationId: string): Promise<(Reservation & { rooms: ReservationRoom[] }) | undefined> {
    const full = await this.getFullById(reservationId);
    if (!full) return undefined;
    return { ...full, rooms: full.rooms ?? [] };
  }

  async getAllReservationRooms(): Promise<ReservationRoom[]> {
    const all = await this.getAll();
    return all.flatMap((r) => r.rooms ?? []);
  }

  async getRoomsByReservationId(reservationId: string): Promise<ReservationRoom[]> {
    return this.getReservationRooms(reservationId);
  }

  async create(payload: CreateReservationPayload): Promise<ApiReservation> {
    const json = await apiFetch<{ data: ApiReservation }>('/api/reservations', {
      method: 'POST',
      body: payload,
    });
    return json.data;
  }

  async update(id: string, updates: UpdateReservationPayload): Promise<ApiReservation> {
    const json = await apiFetch<{ data: ApiReservation }>(`/api/reservations/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: updates,
    });
    return json.data;
  }

  async cancel(id: string): Promise<boolean> {
    try {
      await apiFetch(`/api/reservations/${encodeURIComponent(id)}/cancel`, { method: 'POST' });
      return true;
    } catch {
      return false;
    }
  }

  async checkIn(id: string): Promise<boolean> {
    try {
      await apiFetch(`/api/reservations/${encodeURIComponent(id)}/check-in`, { method: 'POST' });
      return true;
    } catch {
      return false;
    }
  }

  async checkOut(id: string): Promise<boolean> {
    try {
      await apiFetch(`/api/reservations/${encodeURIComponent(id)}/check-out`, { method: 'POST' });
      return true;
    } catch {
      return false;
    }
  }

  /** Room ids booked by other reservations overlapping the range. */
  async getAvailability(checkInDate: string, checkOutDate: string, excludeReservationId?: string): Promise<string[]> {
    const params = new URLSearchParams({ checkIn: checkInDate, checkOut: checkOutDate });
    if (excludeReservationId) params.set('excludeId', excludeReservationId);
    const json = await apiFetch<{ data: { bookedRoomIds: string[] } }>(`/api/reservations/availability?${params}`);
    return json.data.bookedRoomIds;
  }
}

export const reservationService = new ReservationService();
export default reservationService;
