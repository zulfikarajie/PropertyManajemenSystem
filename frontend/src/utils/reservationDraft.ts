import { reservationService } from '@/services/reservationService';
import { reservationPricingService } from '@/services/reservationPricingService';
import { roomService } from '@/services/roomService';
import { roomTypeService } from '@/services/roomTypeService';
import type { ReservationRoom } from '@/types/auth.types';
import type { ReservationDraft } from '@/types/reservationDraft.types';
import { createEmptyDraft } from '@/types/reservationDraft.types';

/** Sum of selected rooms' room-type default rates (per-night reference, aggregate). */
export function resolveReferenceRate(roomIds: string[]): { referenceRate: number; roomTypeName: string } {
  if (roomIds.length === 0) return { referenceRate: 0, roomTypeName: '' };
  let total = 0;
  const names = new Set<string>();
  for (const roomId of roomIds) {
    const room = roomService.getById(roomId);
    if (!room) continue;
    const rt = roomTypeService.getById(room.roomTypeId);
    if (!rt) continue;
    total += Number(rt.defaultRate) || 0;
    names.add(rt.name);
  }
  return {
    referenceRate: total,
    roomTypeName: names.size === 1 ? [...names][0] : names.size > 1 ? `${names.size} room types` : '',
  };
}

/** Build the shared wizard draft for new or existing reservations. */
export function buildReservationDraft(id?: string): ReservationDraft {
  if (!id) return createEmptyDraft();
  const existing = reservationService.getById(id);
  if (!existing) return createEmptyDraft();
  const rooms = reservationService.getRoomsByReservationId(id);
  const { referenceRate } = resolveReferenceRate(rooms.map((r) => r.roomId));
  const pricing = reservationPricingService.getState(id, {
    checkInDate: existing.checkInDate,
    checkOutDate: existing.checkOutDate,
    referenceRate: referenceRate || 750000,
    rateSource: existing.source,
  });
  return {
    guestName: existing.guestName || '',
    notes: existing.notes || '',
    source: existing.source || '',
    checkInDate: existing.checkInDate || '',
    checkOutDate: existing.checkOutDate || '',
    roomIds: rooms.map((r) => r.roomId),
    pricing,
  };
}

/**
 * Mock availability: room ids booked by OTHER reservations overlapping
 * [checkIn, checkOut). Frontend-only, derived from mock reservation data.
 */
export function getBookedRoomIdsForRange(checkInDate: string, checkOutDate: string, excludeReservationId?: string): string[] {
  if (!checkInDate || !checkOutDate) return [];
  const ci = new Date(`${checkInDate}T00:00:00`);
  const co = new Date(`${checkOutDate}T00:00:00`);
  if (Number.isNaN(ci.getTime()) || Number.isNaN(co.getTime()) || co <= ci) return [];
  const booked = new Set<string>();
  for (const r of reservationService.getAll()) {
    if (r.id === excludeReservationId) continue;
    if (r.status === 'cancelled') continue;
    const rci = new Date(`${r.checkInDate}T00:00:00`);
    const rco = new Date(`${r.checkOutDate}T00:00:00`);
    if (Number.isNaN(rci.getTime()) || Number.isNaN(rco.getTime())) continue;
    // Overlap: stay intervals intersect
    if (rci < co && ci < rco) {
      for (const room of reservationService.getRoomsByReservationId(r.id)) {
        booked.add(room.roomId);
      }
    }
  }
  return [...booked];
}

/**
 * Persist the wizard draft to frontend mock state.
 * Returns the reservation id. Totals always derive from nightly rates.
 */
export function saveReservationDraft(id: string | undefined, draft: ReservationDraft): string {
  const roomTotal = draft.pricing.nightlyRates.reduce((s, n) => s + (Number.isFinite(n.rate) ? n.rate : 0), 0);
  const notes = typeof draft.notes === 'string' ? draft.notes : '';

  if (id) {
    reservationService.update(id, {
      guestName: draft.guestName.trim(),
      source: draft.source,
      checkInDate: draft.checkInDate,
      checkOutDate: draft.checkOutDate,
      notes,
      totalAmount: roomTotal,
    } as never);
    reservationPricingService.save(id, draft.pricing, draft.source);
    return id;
  }

  const nights = draft.pricing.nightlyRates.length;
  const roomCount = Math.max(1, draft.roomIds.length);
  const perRoomTotals: number[] = [];
  let assigned = 0;
  for (let i = 0; i < draft.roomIds.length; i += 1) {
    if (i === draft.roomIds.length - 1) {
      perRoomTotals.push(roomTotal - assigned);
    } else {
      const share = Math.round(roomTotal / roomCount);
      perRoomTotals.push(share);
      assigned += share;
    }
  }
  const rooms: Omit<ReservationRoom, 'id' | 'createdAt'>[] = draft.roomIds.map((roomId, idx) => {
    const room = roomService.getById(roomId);
    const rt = room?.roomTypeId ? roomTypeService.getById(room.roomTypeId) : undefined;
    const perRoomTotal = perRoomTotals[idx] ?? 0;
    return {
      reservationId: '',
      roomId,
      roomNumber: room?.roomNumber || '',
      roomTypeName: rt?.name || '',
      rate: nights > 0 ? Math.round(perRoomTotal / nights) : perRoomTotal,
      subtotal: perRoomTotal,
    };
  });

  const created = reservationService.create(
    {
      guestName: draft.guestName.trim(),
      source: draft.source,
      checkInDate: draft.checkInDate,
      checkOutDate: draft.checkOutDate,
      notes,
      reservationCode: `RSV-2026-${String(reservationService.getAll().length + 1).padStart(3, '0')}`,
      totalAmount: roomTotal,
      status: 'reserved',
    } as never,
    rooms as never,
  );
  reservationPricingService.save(created.id, draft.pricing, draft.source);
  return created.id;
}
