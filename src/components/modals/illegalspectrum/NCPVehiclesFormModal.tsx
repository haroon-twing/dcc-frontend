import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface NCPVehiclesFormState {
  id?: string;
  is_db_formed: boolean;
  no_cps_auth_lookfor_seize_ncp: number;
  no_ncp_veh_regularized: number;
  no_ncp_owners_apprehended: number;
  no_ncp_owners_convicted: number;
  no_ncp_owners_setfreebycourt: number;
  no_ncp_owners_casepending: number;
  remarks: string;
}

interface NCPVehiclesFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: NCPVehiclesFormState;
  setFormData: React.Dispatch<React.SetStateAction<NCPVehiclesFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const NCPVehiclesFormModal: React.FC<NCPVehiclesFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add NCP Vehicles Record',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof NCPVehiclesFormState, value: any) => {
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
          <div>
            <label className="flex items-center space-x-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={formData.is_db_formed}
                onChange={(e) => handleChange('is_db_formed', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span>DB Formed</span>
            </label>
          </div>
        </div>

        {/* Vehicle Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Vehicle Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="No. CPS Authorized to Look/Seize NCP"
              type="number"
              value={formData.no_cps_auth_lookfor_seize_ncp.toString()}
              onChange={(e) => handleChange('no_cps_auth_lookfor_seize_ncp', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. NCP Vehicles Regularized"
              type="number"
              value={formData.no_ncp_veh_regularized.toString()}
              onChange={(e) => handleChange('no_ncp_veh_regularized', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
          </div>
        </div>

        {/* Owner Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">NCP Owner Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="No. NCP Owners Apprehended"
              type="number"
              value={formData.no_ncp_owners_apprehended.toString()}
              onChange={(e) => handleChange('no_ncp_owners_apprehended', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. NCP Owners Convicted"
              type="number"
              value={formData.no_ncp_owners_convicted.toString()}
              onChange={(e) => handleChange('no_ncp_owners_convicted', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. NCP Owners Set Free by Court"
              type="number"
              value={formData.no_ncp_owners_setfreebycourt.toString()}
              onChange={(e) => handleChange('no_ncp_owners_setfreebycourt', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. NCP Owners Cases Pending"
              type="number"
              value={formData.no_ncp_owners_casepending.toString()}
              onChange={(e) => handleChange('no_ncp_owners_casepending', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Additional Information</h3>
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

export default NCPVehiclesFormModal;

