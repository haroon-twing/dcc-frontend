import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface MeetingFormState {
  meeting_conducting_authority: string;
  no_of_participants: number;
  conducted_on_date: string;
  venue: string;
  agenda: string;
  decision_taken: string;
  remarks: string;
}

interface MeetingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: MeetingFormState;
  setFormData: React.Dispatch<React.SetStateAction<MeetingFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const MeetingFormModal: React.FC<MeetingFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Meeting',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (field: keyof MeetingFormState, value: string | number) => {
    if (viewMode) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="meeting_conducting_authority" className="block text-sm font-medium mb-1">
            Meeting Conducting Authority <span className="text-red-500">*</span>
          </label>
          <Input
            id="meeting_conducting_authority"
            type="text"
            value={formData.meeting_conducting_authority}
            onChange={(e) => handleChange('meeting_conducting_authority', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter meeting conducting authority"
          />
        </div>

        <div>
          <label htmlFor="no_of_participants" className="block text-sm font-medium mb-1">
            Number of Participants <span className="text-red-500">*</span>
          </label>
          <Input
            id="no_of_participants"
            type="number"
            value={formData.no_of_participants || ''}
            onChange={(e) => handleChange('no_of_participants', parseInt(e.target.value) || 0)}
            required
            disabled={viewMode}
            min="0"
            placeholder="Enter number of participants"
          />
        </div>

        <div>
          <label htmlFor="conducted_on_date" className="block text-sm font-medium mb-1">
            Conducted On Date <span className="text-red-500">*</span>
          </label>
          <Input
            id="conducted_on_date"
            type="datetime-local"
            value={formData.conducted_on_date ? new Date(formData.conducted_on_date).toISOString().slice(0, 16) : ''}
            onChange={(e) => {
              const dateValue = e.target.value ? new Date(e.target.value).toISOString() : '';
              handleChange('conducted_on_date', dateValue);
            }}
            required
            disabled={viewMode}
          />
        </div>

        <div>
          <label htmlFor="venue" className="block text-sm font-medium mb-1">
            Venue <span className="text-red-500">*</span>
          </label>
          <Input
            id="venue"
            type="text"
            value={formData.venue}
            onChange={(e) => handleChange('venue', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter venue"
          />
        </div>

        <div>
          <label htmlFor="agenda" className="block text-sm font-medium mb-1">
            Agenda <span className="text-red-500">*</span>
          </label>
          <textarea
            id="agenda"
            value={formData.agenda}
            onChange={(e) => handleChange('agenda', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter agenda"
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="decision_taken" className="block text-sm font-medium mb-1">
            Decision Taken <span className="text-red-500">*</span>
          </label>
          <textarea
            id="decision_taken"
            value={formData.decision_taken}
            onChange={(e) => handleChange('decision_taken', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter decision taken"
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="remarks" className="block text-sm font-medium mb-1">
            Remarks
          </label>
          <textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            disabled={viewMode}
            placeholder="Enter remarks (optional)"
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {!viewMode && (
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : submitLabel}
            </Button>
          </div>
        )}
        {viewMode && (
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default MeetingFormModal;

