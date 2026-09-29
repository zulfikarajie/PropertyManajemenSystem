import { useMemo, useState } from 'react';
import { Modal } from './Modal';
import { ReservationWizard } from './ReservationWizard';
import type { ReservationDraft } from '@/types/reservationDraft.types';
import { buildReservationDraft } from '@/utils/reservationDraft';
import { saveReservationDraft } from '@/utils/reservationDraft';

interface ReservationWizardModalProps {
  open: boolean;
  id?: string;
  onClose: () => void;
  onSaved?: () => void;
}

/**
 * Modal owner for the reservation wizard.
 * The Modal X / overlay / Escape route through the wizard's guarded
 * cancel flow (double confirmation when dirty) via close-request signal.
 */
export function ReservationWizardModal({ open, id, onClose, onSaved }: ReservationWizardModalProps) {
  const [saving, setSaving] = useState(false);
  const [closeSignal, setCloseSignal] = useState(0);

  const initialDraft = useMemo(() => buildReservationDraft(id), [id, open]);

  if (!open) return null;

  const handleSave = (draft: ReservationDraft) => {
    setSaving(true);
    try {
      saveReservationDraft(id, draft);
      onSaved?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={() => setCloseSignal((s) => s + 1)} title={id ? 'Edit Reservation' : 'Create Reservation'} size="xl">
      <ReservationWizard
        key={id || 'new'}
        initialDraft={initialDraft}
        isEdit={!!id}
        excludeReservationId={id}
        saving={saving}
        onSave={handleSave}
        onDiscard={onClose}
        externalCloseRequest={closeSignal}
      />
    </Modal>
  );
}
