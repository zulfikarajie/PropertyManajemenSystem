import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { reservationService } from '@/services/reservationService';
import { invoiceService } from '@/services/invoiceService';
import { reservationStatusLabels } from '@/constants/reservationStatuses';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

interface DayReservationsPopupProps {
  date: Date | null;
  filterRoomId?: string;
  filterStatus?: string;
  onClose: () => void;
  onViewAll: (date: Date) => void;
}

const statusVariantMap: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  reserved: 'warning',
  'checked-in': 'success',
  'checked-out': 'info',
  cancelled: 'danger',
};

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatPopupDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function DayReservationsPopup({ date, filterRoomId, filterStatus, onClose, onViewAll }: DayReservationsPopupProps) {
  const open = date !== null;

  const dayReservations = (() => {
    if (!date) return [];
    const all = reservationService.getAll();
    return all.filter((r) => {
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterRoomId) {
        const rooms = reservationService.getRoomsByReservationId(r.id);
        if (!rooms.find((room) => room.roomId === filterRoomId)) return false;
      }
      const checkIn = new Date(r.checkInDate);
      const checkOut = new Date(r.checkOutDate);
      const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const ci = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate());
      const co = new Date(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate());
      return isSameDay(ci, day) || (day > ci && day < co) || isSameDay(co, day);
    });
  })();

  const invoices = invoiceService.getAll();
  const invoiceByReservationId = new Map(invoices.map((inv) => [inv.reservationId, inv]));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={date ? `Reservations — ${formatPopupDate(date)}` : 'Reservations'}
      size="lg"
      footer={
        date ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={() => onViewAll(date)}>View All Reservations</Button>
          </div>
        ) : undefined
      }
    >
      {date && dayReservations.length === 0 && (
        <EmptyState
          icon={<CalendarDays size={32} aria-hidden="true" />}
          title="No reservations for this date."
          description={`There are no reservations on ${formatPopupDate(date)}.`}
        />
      )}

      {date && dayReservations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dayReservations.map((r) => {
            const rooms = reservationService.getRoomsByReservationId(r.id);
            const invoice = invoiceByReservationId.get(r.id);
            return (
              <div
                key={r.id}
                style={{
                  border: '1px solid #C7BBAB',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <div>
                    <Link
                      to={`/dashboard/reservations/${r.id}`}
                      style={{ fontSize: '15px', fontWeight: 700, color: '#232D36', textDecoration: 'none', fontFamily: 'var(--font-family-sans)' }}
                    >
                      {r.reservationCode}
                    </Link>
                    <p style={{ margin: '2px 0 0 0', fontSize: '14px', color: '#232D36', fontWeight: 600 }}>{r.guestName}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <Badge variant={statusVariantMap[r.status] || 'default'}>
                      {reservationStatusLabels[r.status] || r.status}
                    </Badge>
                    {invoice && (
                      <Badge variant={invoice.paymentStatus === 'Paid' ? 'success' : invoice.paymentStatus === 'Overdue' ? 'danger' : 'info'}>
                        {invoice.paymentStatus}
                      </Badge>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#6B7881' }}>
                  <span>
                    {rooms.length > 0
                      ? rooms.map((room) => `Room ${room.roomNumber} (${room.roomTypeName})`).join(', ')
                      : 'No rooms'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#6B7881', marginTop: '4px' }}>
                  <span>Check-in: {r.checkInDate}</span>
                  <span>Check-out: {r.checkOutDate}</span>
                  {invoice && <span>Invoice: {invoice.invoiceNumber}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
