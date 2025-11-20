import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { ExtortionIncidentFormState } from '../../illegalspectrum/ExtortionIncidents';

interface ExtortionIncidentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ExtortionIncidentFormState;
  setFormData: React.Dispatch<React.SetStateAction<ExtortionIncidentFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const ExtortionIncidentFormModal: React.FC<ExtortionIncidentFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Extortion Incident',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof ExtortionIncidentFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="xl">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1 max-h-[80vh] overflow-y-auto">
        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          disabled={viewMode}
          required
        />
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          disabled={viewMode}
          required
        />
        <Input
          label="Extorted From"
          value={formData.extorted_from}
          onChange={(e) => handleChange('extorted_from', e.target.value)}
          disabled={viewMode}
        />
        <Input
          label="Extorted By"
          value={formData.extorted_by}
          onChange={(e) => handleChange('extorted_by', e.target.value)}
          disabled={viewMode}
        />
        <Input
          label="Affiliation with Terrorist Group"
          value={formData.affiliation_terr_grp}
          onChange={(e) => handleChange('affiliation_terr_grp', e.target.value)}
          disabled={viewMode}
        />
        <Input
          label="Amount Extorted"
          type="number"
          value={formData.amount_extorted.toString()}
          onChange={(e) => handleChange('amount_extorted', parseFloat(e.target.value) || 0)}
          disabled={viewMode}
          min="0"
        />
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Action Taken</label>
          <textarea
            value={formData.action_taken}
            onChange={(e) => handleChange('action_taken', e.target.value)}
            rows={3}
            disabled={viewMode}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-vertical"
            placeholder="Describe the action taken"
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

export default ExtortionIncidentFormModal;

