import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';

export interface BlackMarketDronesFormState {
  id?: string;
  is_identification_of_agencies: boolean;
  is_db_vendor_formed: boolean;
}

interface BlackMarketDronesFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: BlackMarketDronesFormState;
  setFormData: React.Dispatch<React.SetStateAction<BlackMarketDronesFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const BlackMarketDronesFormModal: React.FC<BlackMarketDronesFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Black Market Drones Record',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof BlackMarketDronesFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="lg">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Status Flags</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={formData.is_identification_of_agencies}
                onChange={(e) => handleChange('is_identification_of_agencies', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span>Identification of Agencies</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={formData.is_db_vendor_formed}
                onChange={(e) => handleChange('is_db_vendor_formed', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span>DB Vendor Formed</span>
            </label>
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

export default BlackMarketDronesFormModal;

