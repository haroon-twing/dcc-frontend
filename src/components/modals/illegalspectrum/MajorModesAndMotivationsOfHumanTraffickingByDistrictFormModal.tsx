import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { MajorModesAndMotivationsOfHumanTraffickingByDistrictFormState } from '../../illegalspectrum/MajorModesAndMotivationsOfHumanTraffickingByDistrict';

interface MajorModesAndMotivationsOfHumanTraffickingByDistrictFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: MajorModesAndMotivationsOfHumanTraffickingByDistrictFormState;
  setFormData: React.Dispatch<React.SetStateAction<MajorModesAndMotivationsOfHumanTraffickingByDistrictFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const MajorModesAndMotivationsOfHumanTraffickingByDistrictFormModal: React.FC<MajorModesAndMotivationsOfHumanTraffickingByDistrictFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Major Modes and Motivations of Human Trafficking by District',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof MajorModesAndMotivationsOfHumanTraffickingByDistrictFormState, value: any) => {
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
          value={formData.dist_id}
          onChange={(e) => handleChange('dist_id', e.target.value)}
          disabled={viewMode}
          required
        />
        <Input
          label="% Population Trafficked (Last Month)"
          type="number"
          step="0.1"
          value={formData.per_pop_trafficked_last_month.toString()}
          onChange={(e) => handleChange('per_pop_trafficked_last_month', parseFloat(e.target.value) || 0)}
          disabled={viewMode}
        />
        <Input
          label="Modes of Human Trafficking"
          value={formData.modes_ht}
          onChange={(e) => handleChange('modes_ht', e.target.value)}
          disabled={viewMode}
        />
        <Input
          label="Motivation of Human Trafficking"
          value={formData.motivation_ht}
          onChange={(e) => handleChange('motivation_ht', e.target.value)}
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

export default MajorModesAndMotivationsOfHumanTraffickingByDistrictFormModal;

