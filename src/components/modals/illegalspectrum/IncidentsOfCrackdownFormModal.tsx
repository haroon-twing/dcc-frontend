import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { IncidentsOfCrackdownFormState } from '../../illegalspectrum/IncidentsOfCrackdown';

interface IncidentsOfCrackdownFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: IncidentsOfCrackdownFormState;
  setFormData: React.Dispatch<React.SetStateAction<IncidentsOfCrackdownFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const IncidentsOfCrackdownFormModal: React.FC<IncidentsOfCrackdownFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Incident of Crackdown',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof IncidentsOfCrackdownFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="xl">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1 max-h-[80vh] overflow-y-auto">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          disabled={viewMode}
          required
        />
        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          disabled={viewMode}
          required
        />
        <Input
          label="No. People Apprehended"
          type="number"
          value={formData.no_people_apprehend.toString()}
          onChange={(e) => handleChange('no_people_apprehend', parseInt(e.target.value) || 0)}
          disabled={viewMode}
          min="0"
        />
        <Input
          label="Recoveries"
          value={formData.recoveries}
          onChange={(e) => handleChange('recoveries', e.target.value)}
          disabled={viewMode}
        />
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Details</label>
          <textarea
            value={formData.details}
            onChange={(e) => handleChange('details', e.target.value)}
            rows={4}
            disabled={viewMode}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-vertical"
            placeholder="Detailed crackdown information"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Remarks</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            rows={3}
            disabled={viewMode}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-vertical"
            placeholder="Additional notes"
          />
        </div>

        {!viewMode && (
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
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
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
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

export default IncidentsOfCrackdownFormModal;

