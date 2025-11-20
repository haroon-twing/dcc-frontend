import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { PrevalenceOfOutOfZoneSimsFormState } from '../../illegalspectrum/PrevalenceOfOutOfZoneSims';

interface PrevalenceOfOutOfZoneSimsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PrevalenceOfOutOfZoneSimsFormState;
  setFormData: React.Dispatch<React.SetStateAction<PrevalenceOfOutOfZoneSimsFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const PrevalenceOfOutOfZoneSimsFormModal: React.FC<PrevalenceOfOutOfZoneSimsFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Prevalence of Out of Zone SIMs',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof PrevalenceOfOutOfZoneSimsFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="lg">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1 max-h-[80vh] overflow-y-auto">
        <Input
          label="District ID"
          type="number"
          value={formData.distid.toString()}
          onChange={(e) => handleChange('distid', parseInt(e.target.value) || 0)}
          disabled={viewMode}
          required
          min="0"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="% Population Using SIMs"
            type="number"
            step="0.1"
            value={formData.per_population_using_sims.toString()}
            onChange={(e) => handleChange('per_population_using_sims', parseFloat(e.target.value) || 0)}
            disabled={viewMode}
          />
          <Input
            label="% Out Zone SIMs Used (Total)"
            type="number"
            step="0.1"
            value={formData.per_outzone_sims_used_total.toString()}
            onChange={(e) => handleChange('per_outzone_sims_used_total', parseFloat(e.target.value) || 0)}
            disabled={viewMode}
          />
        </div>
        <Input
          label="% Afghan SIMs Used from Out Zone SIMs"
          type="number"
          step="0.1"
          value={formData.per_afghan_sims_used_from_outzone_sims.toString()}
          onChange={(e) => handleChange('per_afghan_sims_used_from_outzone_sims', parseFloat(e.target.value) || 0)}
          disabled={viewMode}
        />
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

export default PrevalenceOfOutOfZoneSimsFormModal;

