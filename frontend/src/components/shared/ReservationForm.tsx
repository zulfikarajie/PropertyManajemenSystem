import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { Button } from './Button';
import { reservationSources, reservationSourceLabels } from '@/constants/reservationStatuses';
import { RoomSelector } from './RoomSelector';
import { Card } from './Card';

const createReservationSchema = z.object({
  guestName: z.string().min(2, 'Guest name must be at least 2 characters'),
  source: z.string().min(1, 'Source is required'),
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  roomIds: z.array(z.string()).min(1, 'At least one room is required'),
  notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional().default(''),
});

type CreateReservationFormData = z.infer<typeof createReservationSchema>;

interface ReservationFormProps {
  initialData?: Partial<CreateReservationFormData>;
  onSubmit: (data: CreateReservationFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function ReservationForm({ initialData, onSubmit, onCancel, loading = false }: ReservationFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateReservationFormData>({
    resolver: zodResolver(createReservationSchema),
    defaultValues: {
      guestName: initialData?.guestName || '',
      source: initialData?.source || '',
      checkInDate: initialData?.checkInDate || '',
      checkOutDate: initialData?.checkOutDate || '',
      roomIds: initialData?.roomIds || [],
      notes: initialData?.notes || '',
    },
  });

  const selectedRooms = watch('roomIds') || [];

  const handleRoomToggle = (roomId: string) => {
    const current = watch('roomIds') || [];
    if (current.includes(roomId)) {
      setValue('roomIds', current.filter((id) => id !== roomId), { shouldValidate: true });
    } else {
      setValue('roomIds', [...current, roomId], { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <Input
            label="Guest Name"
            error={!!errors.guestName}
            errorMessage={errors.guestName?.message}
            {...register('guestName')}
            placeholder="Enter guest name"
          />
          <Select
            label="Source"
            error={!!errors.source}
            options={reservationSources.map((s) => ({ value: s, label: reservationSourceLabels[s] || s }))}
            {...register('source')}
          />
          <Input
            label="Check-in Date"
            type="date"
            error={!!errors.checkInDate}
            errorMessage={errors.checkInDate?.message}
            {...register('checkInDate')}
          />
          <Input
            label="Check-out Date"
            type="date"
            error={!!errors.checkOutDate}
            errorMessage={errors.checkOutDate?.message}
            {...register('checkOutDate')}
          />
        </div>
      </Card>

      <Card title="Notes">
        <Textarea
          label="Notes"
          hint="Optional"
          rows={4}
          placeholder="Add special requests, guest notes, internal notes, or other reservation information..."
          error={!!errors.notes}
          errorMessage={errors.notes?.message}
          {...register('notes')}
        />
      </Card>

      <Card title="Room Selection">
        <RoomSelector selectedRooms={selectedRooms} onRoomToggle={handleRoomToggle} />
        {errors.roomIds && (
          <span style={{ fontSize: '12px', color: '#C85C5C', marginTop: '4px', display: 'block' }}>{errors.roomIds.message}</span>
        )}
      </Card>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button type="submit" loading={loading}>
          {initialData ? 'Update Reservation' : 'Create Reservation'}
        </Button>
      </div>
    </form>
  );
}
