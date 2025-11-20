import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface IllegalSimsFormState {
  id?: string;
  no_vend_selling_ill_sims: number;
  is_db_formed: boolean;
  no_vend_apprehended: number;
  no_vend_convicted: number;
  no_vend_setfree: number;
  no_cases_pending_appr_vendors: number;
  no_people_appr_using_ill_sims: number;
  no_people_appr_using_ill_sims_convicted: number;
  no_people_appr_using_ill_sims_setfree: number;
  no_cases_pending_appr_people: number;
  policy_action_taken: string;
  out_zone_sims_detected: number;
  afghan_sims_detected: number;
  per_out_zone_sims_found_to_be_afghan: number;
  remarks: string;
}

interface IllegalSimsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: IllegalSimsFormState;
  setFormData: React.Dispatch<React.SetStateAction<IllegalSimsFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const IllegalSimsFormModal: React.FC<IllegalSimsFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Illegal Sims Record',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof IllegalSimsFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="xl">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1 max-h-[80vh] overflow-y-auto">
        {/* Vendor Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Vendor Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="No. Vendors Selling Illegal SIMs"
              type="number"
              value={formData.no_vend_selling_ill_sims.toString()}
              onChange={(e) => handleChange('no_vend_selling_ill_sims', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
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
            <Input
              label="No. Vendors Apprehended"
              type="number"
              value={formData.no_vend_apprehended.toString()}
              onChange={(e) => handleChange('no_vend_apprehended', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Vendors Convicted"
              type="number"
              value={formData.no_vend_convicted.toString()}
              onChange={(e) => handleChange('no_vend_convicted', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Vendors Set Free"
              type="number"
              value={formData.no_vend_setfree.toString()}
              onChange={(e) => handleChange('no_vend_setfree', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Cases Pending (Apprehended Vendors)"
              type="number"
              value={formData.no_cases_pending_appr_vendors.toString()}
              onChange={(e) => handleChange('no_cases_pending_appr_vendors', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
          </div>
        </div>

        {/* People Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">People Using Illegal SIMs Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="No. People Apprehended Using Illegal SIMs"
              type="number"
              value={formData.no_people_appr_using_ill_sims.toString()}
              onChange={(e) => handleChange('no_people_appr_using_ill_sims', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. People Apprehended Using Illegal SIMs - Convicted"
              type="number"
              value={formData.no_people_appr_using_ill_sims_convicted.toString()}
              onChange={(e) => handleChange('no_people_appr_using_ill_sims_convicted', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. People Apprehended Using Illegal SIMs - Set Free"
              type="number"
              value={formData.no_people_appr_using_ill_sims_setfree.toString()}
              onChange={(e) => handleChange('no_people_appr_using_ill_sims_setfree', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Cases Pending (Apprehended People)"
              type="number"
              value={formData.no_cases_pending_appr_people.toString()}
              onChange={(e) => handleChange('no_cases_pending_appr_people', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
          </div>
        </div>

        {/* Policy and SIM Detection */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Policy and SIM Detection</h3>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
            <Input
              label="Policy Action Taken"
              value={formData.policy_action_taken}
              onChange={(e) => handleChange('policy_action_taken', e.target.value)}
              disabled={viewMode}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Out Zone SIMs Detected"
              type="number"
              value={formData.out_zone_sims_detected.toString()}
              onChange={(e) => handleChange('out_zone_sims_detected', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="Afghan SIMs Detected"
              type="number"
              value={formData.afghan_sims_detected.toString()}
              onChange={(e) => handleChange('afghan_sims_detected', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="% Out Zone SIMs Found to be Afghan"
              type="number"
              step="0.1"
              value={formData.per_out_zone_sims_found_to_be_afghan.toString()}
              onChange={(e) => handleChange('per_out_zone_sims_found_to_be_afghan', parseFloat(e.target.value) || 0)}
              disabled={viewMode}
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

export default IllegalSimsFormModal;

