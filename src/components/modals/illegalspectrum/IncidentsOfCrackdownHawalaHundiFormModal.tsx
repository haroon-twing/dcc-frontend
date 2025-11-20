import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { IncidentsOfCrackdownHawalaHundiFormState } from '../../illegalspectrum/IncidentsOfCrackdownHawalaHundi';

interface IncidentsOfCrackdownHawalaHundiFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: IncidentsOfCrackdownHawalaHundiFormState;
  setFormData: React.Dispatch<React.SetStateAction<IncidentsOfCrackdownHawalaHundiFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const IncidentsOfCrackdownHawalaHundiFormModal: React.FC<IncidentsOfCrackdownHawalaHundiFormModalProps> = ({
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
  const handleChange = (key: keyof IncidentsOfCrackdownHawalaHundiFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="xl">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="No. People Apprehended"
            type="number"
            value={formData.no_people_apprehend.toString()}
            onChange={(e) => handleChange('no_people_apprehend', parseInt(e.target.value) || 0)}
            disabled={viewMode}
            min="0"
          />
          <Input
            label="Recoveries (PKR)"
            type="number"
            value={formData.recoveries_pkr.toString()}
            onChange={(e) => handleChange('recoveries_pkr', parseFloat(e.target.value) || 0)}
            disabled={viewMode}
            min="0"
            step="0.01"
          />
        </div>
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
        <div>
          <label className="flex items-center space-x-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              disabled={viewMode}
              className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
            />
            <span>Active</span>
          </label>
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

export default IncidentsOfCrackdownHawalaHundiFormModal;

