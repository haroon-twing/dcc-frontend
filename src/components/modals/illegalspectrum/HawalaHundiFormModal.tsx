import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface HawalaHundiFormState {
  id?: string;
  is_db_dealer_formed: boolean;
  no_dealers_convicted: number;
  no_dealers_freebycourt: number;
  no_delaers_cases_pending: number;
  is_mthly_review_prep: boolean;
  per_change_inflow: number;
  is_active: boolean;
}

interface HawalaHundiFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: HawalaHundiFormState;
  setFormData: React.Dispatch<React.SetStateAction<HawalaHundiFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const HawalaHundiFormModal: React.FC<HawalaHundiFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Hawala/ Hundi Record',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof HawalaHundiFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="lg">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1 max-h-[80vh] overflow-y-auto">
        {/* Status Flags */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Status Flags</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center space-x-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={formData.is_db_dealer_formed}
                onChange={(e) => handleChange('is_db_dealer_formed', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span>DB Dealer Formed</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={formData.is_mthly_review_prep}
                onChange={(e) => handleChange('is_mthly_review_prep', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span>Monthly Review Prepared</span>
            </label>
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
        </div>

        {/* Dealer Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Dealer Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="No. Dealers Convicted"
              type="number"
              value={formData.no_dealers_convicted.toString()}
              onChange={(e) => handleChange('no_dealers_convicted', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Dealers Freed by Court"
              type="number"
              value={formData.no_dealers_freebycourt.toString()}
              onChange={(e) => handleChange('no_dealers_freebycourt', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Dealers Cases Pending"
              type="number"
              value={formData.no_delaers_cases_pending.toString()}
              onChange={(e) => handleChange('no_delaers_cases_pending', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
          </div>
        </div>

        {/* Inflow Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Inflow Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
            <Input
              label="% Change Inflow"
              type="number"
              step="0.1"
              value={formData.per_change_inflow.toString()}
              onChange={(e) => handleChange('per_change_inflow', parseFloat(e.target.value) || 0)}
              disabled={viewMode}
            />
          </div>
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

export default HawalaHundiFormModal;

