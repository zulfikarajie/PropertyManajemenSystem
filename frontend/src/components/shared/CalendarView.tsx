import { useState, useMemo } from 'react';
import { reservationService } from '@/services/reservationService';
import { Button } from './Button';
import { Card } from './Card';

interface CalendarViewProps {
  filterDate?: Date;
  filterRoomId?: string;
  filterStatus?: string;
  filterSearch?: string;
  onDateClick?: (date: Date) => void;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function eachDayOfInterval(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
}

function subMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() - months, date.getDate());
}

const statusFillMap: Record<string, { bg: string; text: string }> = {
  reserved: { bg: '#F0E7D3', text: '#7A5A1E' },
  'checked-in': { bg: '#E3EDE4', text: '#2F5D37' },
  'checked-out': { bg: '#DDE5EC', text: '#2F4A5E' },
  cancelled: { bg: '#F3DEDE', text: '#962222' },
};

export function CalendarView({ filterDate = new Date(), filterRoomId, filterStatus, filterSearch, onDateClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(filterDate);
  const reservations = reservationService.getAll();

  const filteredReservations = useMemo(() => {
    const q = (filterSearch || '').toLowerCase();
    return reservations.filter((r) => {
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterRoomId) {
        const rooms = reservationService.getRoomsByReservationId(r.id);
        if (!rooms.find((room) => room.roomId === filterRoomId)) return false;
      }
      if (q && !r.guestName.toLowerCase().includes(q) && !r.reservationCode.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [reservations, filterRoomId, filterStatus, filterSearch]);

  const days = useMemo(() => {
    return eachDayOfInterval(startOfMonth(currentMonth), endOfMonth(currentMonth));
  }, [currentMonth]);

  const getReservationsForDay = (day: Date) => {
    return filteredReservations.filter((r) => {
      const checkIn = new Date(r.checkInDate);
      const checkOut = new Date(r.checkOutDate);
      return isSameDay(checkIn, day) || (day > checkIn && day < checkOut) || isSameDay(checkOut, day);
    });
  };

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const monthName = monthNames[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <Button variant="outline" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>← Prev</Button>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#232D36', fontFamily: 'var(--font-family-sans)' }}>
            {monthName} {year}
          </h3>
          <Button variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next →</Button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minWidth: '700px', gap: '2px' }}>
            {dayNames.map((day) => (
              <div key={day} style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6B7881', borderBottom: '1px solid #C7BBAB' }}>
                {day}
              </div>
            ))}
            {days.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const dayReservations = getReservationsForDay(day);
              const label = `${day.getDate()} ${monthName} ${year}, ${dayReservations.length} reservation${dayReservations.length === 1 ? '' : 's'}`;
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => onDateClick?.(day)}
                  aria-label={label}
                  style={{
                    padding: '4px',
                    border: isToday ? '2px solid #97764D' : '1px solid #C7BBAB',
                    borderRadius: '8px',
                    backgroundColor: isCurrentMonth ? '#FFFFFF' : '#EEEDE9',
                    minHeight: '80px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-family-sans)',
                    transition: 'border-color 150ms ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid #97764D';
                    e.currentTarget.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: isToday ? 700 : 400, color: isCurrentMonth ? '#232D36' : '#6B7881', marginBottom: '2px' }}>
                    {day.getDate()}
                  </div>
                  {dayReservations.slice(0, 3).map((r) => {
                    const fill = statusFillMap[r.status] || { bg: '#EEEDE9', text: '#232D36' };
                    return (
                      <div
                        key={r.id}
                        title={`${r.reservationCode}`}
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '1px 4px',
                          borderRadius: '4px',
                          border: '1px solid #C7BBAB',
                          backgroundColor: fill.bg,
                          color: fill.text,
                          marginBottom: '1px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {r.reservationCode}
                      </div>
                    );
                  })}
                  {dayReservations.length > 3 && (
                    <div style={{ fontSize: '10px', color: '#6B7881' }}>+{dayReservations.length - 3} more</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
