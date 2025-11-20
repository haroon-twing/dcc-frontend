import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { ActionAgainstIllegalVendorFormState } from '../../illegalspectrum/ActionAgainstIllegalVendors';

interface ActionAgainstIllegalVendorFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ActionAgainstIllegalVendorFormState;
  setFormData: React.Dispatch<React.SetStateAction<ActionAgainstIllegalVendorFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const ActionAgainstIllegalVendorFormModal: React.FC<ActionAgainstIllegalVendorFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Action Against Illegal Vendor',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof ActionAgainstIllegalVendorFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="lg">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1">
        <Input
          label="LEA"
          value={formData.lea}
          onChange={(e) => handleChange('lea', e.target.value)}
          disabled={viewMode}
          required
        />
        <Input
          label="Illegal Vendors Apprehended"
          type="number"
          value={formData.ill_vend_apprehended.toString()}
          onChange={(e) => handleChange('ill_vend_apprehended', parseInt(e.target.value) || 0)}
          disabled={viewMode}
          min="0"
        />
        <Input
          label="Illegal Vendors Fined"
          type="number"
          value={formData.ill_vend_fined.toString()}
          onChange={(e) => handleChange('ill_vend_fined', parseInt(e.target.value) || 0)}
          disabled={viewMode}
          min="0"
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

export default ActionAgainstIllegalVendorFormModal;

