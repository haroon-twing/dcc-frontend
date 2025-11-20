import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { ActionsTakenAgainstIllegalWarehousesFormState } from '../../illegalspectrum/ActionsTakenAgainstIllegalWarehouses';

interface ActionsTakenAgainstIllegalWarehousesFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ActionsTakenAgainstIllegalWarehousesFormState;
  setFormData: React.Dispatch<React.SetStateAction<ActionsTakenAgainstIllegalWarehousesFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const ActionsTakenAgainstIllegalWarehousesFormModal: React.FC<ActionsTakenAgainstIllegalWarehousesFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Action Taken Against Illegal Warehouse',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof ActionsTakenAgainstIllegalWarehousesFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="lg">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Action Taken By"
            value={formData.action_taken_by}
            onChange={(e) => handleChange('action_taken_by', e.target.value)}
            disabled={viewMode}
            required
          />
          <Input
            label="Date of Action"
            type="date"
            value={formData.date_of_action}
            onChange={(e) => handleChange('date_of_action', e.target.value)}
            disabled={viewMode}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            disabled={viewMode}
          />
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            disabled={viewMode}
          />
        </div>
        <Input
          label="Main Products"
          value={formData.main_products}
          onChange={(e) => handleChange('main_products', e.target.value)}
          disabled={viewMode}
        />
        <Input
          label="Affiliated Terrorist Group"
          value={formData.affiliated_terr_grp}
          onChange={(e) => handleChange('affiliated_terr_grp', e.target.value)}
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

export default ActionsTakenAgainstIllegalWarehousesFormModal;

