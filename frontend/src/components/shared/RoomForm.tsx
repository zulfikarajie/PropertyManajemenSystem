import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { roomService } from '@/services/roomService';
import { roomTypeService } from '@/services/roomTypeService';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import { Card } from './Card';
import { ConfirmDialog } from './ConfirmDialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const roomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  roomTypeId: z.string().min(1, 'Room type is required'),
  status: z.enum(['active', 'inactive', 'maintenance']),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface RoomFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RoomForm({ id, onSuccess, onCancel }: RoomFormProps) {
  const service = roomService;
  const typeService = roomTypeService;
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const existingRoom = id ? service.getById(id) : undefined;
  const allTypes = typeService.getAll();

  const { register, handleSubmit, formState: { errors } } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: existingRoom?.roomNumber || '',
      roomTypeId: existingRoom?.roomTypeId || '',
      status: existingRoom?.status || 'active',
    },
  });

  const onSubmit = async (data: RoomFormData) => {
    setLoading(true);
    try {
      if (isEdit && id) {
        service.update(id, data);
      } else {
        service.create(data as any);
      }
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (id) {
      service.delete(id);
      onSuccess();
    }
    setDeleteConfirm(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <Input
              label="Room Number"
              error={!!errors.roomNumber}
              errorMessage={errors.roomNumber?.message}
              {...register('roomNumber')}
              placeholder="e.g., 101"
            />
            <Select
              label="Room Type"
              error={!!errors.roomTypeId}
              options={[
                { value: '', label: 'Select room type...' },
                ...allTypes.map((t) => ({ value: t.id, label: t.name })),
              ]}
              {...register('roomTypeId')}
            />
            <Select
              label="Status"
              error={!!errors.status}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'maintenance', label: 'Maintenance' },
              ]}
              {...register('status')}
            />
          </div>
        </Card>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {isEdit && (
            <Button type="button" variant="danger" aria-label="Delete room" onClick={() => setDeleteConfirm(true)}><Trash2 size={14} aria-hidden="true" /></Button>
          )}
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Room"
        message="Are you sure you want to delete this room?"
        confirmText="Delete"
        destructive
      />
    </>
  );
}
