import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { NCPStatusByDistrictFormState } from '../../illegalspectrum/NCPStatusByDistrict';

interface NCPStatusByDistrictFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: NCPStatusByDistrictFormState;
  setFormData: React.Dispatch<React.SetStateAction<NCPStatusByDistrictFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const NCPStatusByDistrictFormModal: React.FC<NCPStatusByDistrictFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add NCP Status by District',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof NCPStatusByDistrictFormState, value: any) => {
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
          value={formData.distid}
          onChange={(e) => handleChange('distid', e.target.value)}
          disabled={viewMode}
          required
        />
        <Input
          label="Banned or Legal"
          value={formData.banned_or_legal}
          onChange={(e) => handleChange('banned_or_legal', e.target.value)}
          disabled={viewMode}
        />
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Special Provisions</label>
          <textarea
            value={formData.special_provisions}
            onChange={(e) => handleChange('special_provisions', e.target.value)}
            rows={3}
            disabled={viewMode}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-vertical"
            placeholder="Special provisions for this district"
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

export default NCPStatusByDistrictFormModal;

