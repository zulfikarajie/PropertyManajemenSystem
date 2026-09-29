import { useMemo, useState } from 'react';
import { ReservationWizard } from './ReservationWizard';
import type { ReservationDraft } from '@/types/reservationDraft.types';
import { buildReservationDraft, saveReservationDraft } from '@/utils/reservationDraft';

interface ReservationFormPanelProps {
  id?: string;
  onDone: () => void;
}

/**
 * Content-mode reservation panel (page use + backward compatibility).
 * Modal usages should prefer ReservationWizardModal so the X / overlay /
 * Escape path also goes through the guarded cancel flow.
 */
export function ReservationFormPanel({ id, onDone }: ReservationFormPanelProps) {
  const [saving, setSaving] = useState(false);
  const initialDraft = useMemo(() => buildReservationDraft(id), [id]);

  const handleSave = (draft: ReservationDraft) => {
    setSaving(true);
    try {
      saveReservationDraft(id, draft);
      onDone();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ReservationWizard
      key={id || 'new'}
      initialDraft={initialDraft}
      isEdit={!!id}
      excludeReservationId={id}
      saving={saving}
      onSave={handleSave}
      onDiscard={onDone}
    />
  );
}
