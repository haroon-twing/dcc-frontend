import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { NCPVehicleRecoveryFormState } from '../../../components/illegalspectrum/NCPVehicleRecovery';

interface NCPVehicleRecoveryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: NCPVehicleRecoveryFormState;
  setFormData: React.Dispatch<React.SetStateAction<NCPVehicleRecoveryFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const NCPVehicleRecoveryFormModal: React.FC<NCPVehicleRecoveryFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add NCP Vehicle Recovery',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof NCPVehicleRecoveryFormState, value: any) => {
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
        <Input
          label="Activity Type"
          value={formData.activity_type}
          onChange={(e) => handleChange('activity_type', e.target.value)}
          disabled={viewMode}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Vehicle Number"
            value={formData.vehno}
            onChange={(e) => handleChange('vehno', e.target.value)}
            disabled={viewMode}
            required
          />
          <Input
            label="Vehicle Make/Type"
            value={formData.veh_make_type}
            onChange={(e) => handleChange('veh_make_type', e.target.value)}
            disabled={viewMode}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Owner CNIC"
            value={formData.cnic_owner}
            onChange={(e) => handleChange('cnic_owner', e.target.value)}
            disabled={viewMode}
          />
          <Input
            label="Driver CNIC"
            value={formData.cnic_driver}
            onChange={(e) => handleChange('cnic_driver', e.target.value)}
            disabled={viewMode}
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

export default NCPVehicleRecoveryFormModal;

