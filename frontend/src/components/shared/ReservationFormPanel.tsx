import { useState } from 'react';
import { reservationService } from '@/services/reservationService';
import { ReservationForm } from './ReservationForm';
import type { ReservationRoom } from '@/types/auth.types';

interface ReservationFormPanelProps {
  id?: string;
  onDone: () => void;
}

export function ReservationFormPanel({ id, onDone }: ReservationFormPanelProps) {
  const service = reservationService;
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);

  const existingReservation = id ? service.getById(id) : undefined;

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const normalizedNotes = typeof data.notes === 'string' ? data.notes : '';
      const rooms: ReservationRoom[] = data.roomIds.map((roomId: string) => ({
        reservationId: id || '',
        roomId,
        roomNumber: '',
        roomTypeName: '',
        rate: 0,
        subtotal: 0,
      }));

      if (isEdit && id) {
        service.update(id, { ...data, notes: normalizedNotes } as any);
      } else {
        service.create({
          ...data,
          notes: normalizedNotes,
          reservationCode: `RSV-2026-${String(service.getAll().length + 1).padStart(3, '0')}`,
          totalAmount: data.roomIds.length * 750000,
          status: 'reserved',
        } as any, rooms);
      }
      onDone();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReservationForm
      initialData={isEdit && existingReservation ? {
        guestName: existingReservation.guestName,
        source: existingReservation.source,
        checkInDate: existingReservation.checkInDate,
        checkOutDate: existingReservation.checkOutDate,
        roomIds: service.getRoomsByReservationId(existingReservation.id || '').map((r) => r.roomId),
        notes: existingReservation.notes || '',
      } : undefined}
      onSubmit={handleSubmit}
      onCancel={onDone}
      loading={loading}
    />
  );
}
