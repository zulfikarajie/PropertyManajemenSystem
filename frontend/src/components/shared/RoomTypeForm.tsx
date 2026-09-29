import { useState } from 'react';
import { roomTypeService } from '@/services/roomTypeService';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import { Card } from './Card';
import { ConfirmDialog } from './ConfirmDialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const roomTypeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(1, 'Description is required'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
  defaultRate: z.coerce.number().positive('Default rate must be a positive number'),
  facilities: z.string(),
  status: z.enum(['active', 'inactive']),
});

type RoomTypeFormData = z.infer<typeof roomTypeSchema>;

interface RoomTypeFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RoomTypeForm({ id, onSuccess, onCancel }: RoomTypeFormProps) {
  const service = roomTypeService;
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const existingType = id ? service.getById(id) : undefined;

  const { register, handleSubmit, formState: { errors } } = useForm<RoomTypeFormData>({
    resolver: zodResolver(roomTypeSchema),
    defaultValues: {
      name: existingType?.name || '',
      description: existingType?.description || '',
      capacity: existingType?.capacity || 1,
      defaultRate: existingType?.defaultRate || 0,
      facilities: existingType?.facilities?.join(', ') || '',
      status: existingType?.status || 'active',
    },
  });

  const onSubmit = async (data: RoomTypeFormData) => {
    setLoading(true);
    try {
      const facilities = data.facilities.split(',').map((s) => s.trim()).filter(Boolean);
      if (isEdit && id) {
        service.update(id, { ...data, facilities });
      } else {
        service.create({
          ...data,
          images: [],
          status: data.status,
        } as any);
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
              label="Name"
              error={!!errors.name}
              errorMessage={errors.name?.message}
              {...register('name')}
              placeholder="e.g., Standard"
            />
            <Input
              label="Description"
              error={!!errors.description}
              errorMessage={errors.description?.message}
              {...register('description')}
              placeholder="Describe the room type"
            />
            <Input
              label="Capacity"
              type="number"
              error={!!errors.capacity}
              errorMessage={errors.capacity?.message}
              {...register('capacity')}
            />
            <Input
              label="Default Rate"
              type="number"
              error={!!errors.defaultRate}
              errorMessage={errors.defaultRate?.message}
              {...register('defaultRate')}
            />
            <Input
              label="Facilities (comma-separated)"
              {...register('facilities')}
              placeholder="WiFi, TV, Air Conditioning"
            />
            <Select
              label="Status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              {...register('status')}
            />
          </div>
        </Card>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {isEdit && (
            <Button
              type="button"
              variant="danger"
              onClick={() => setDeleteConfirm(true)}
            >
              Delete
            </Button>
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
        title="Delete Room Type"
        message="Are you sure you want to delete this room type? This action cannot be undone."
        confirmText="Delete"
        destructive
      />
    </>
  );
}
