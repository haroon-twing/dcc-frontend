import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface HumanTraffickingFormState {
  id?: string;
  is_db_formed: boolean;
  no_ops_launch_against_ht_networks: number;
  no_indv_appr_during_ops: number;
  no_indv_neut_during_ops: number;
  no_indv_appr_ht_charges_convicted: number;
  no_indv_appr_ht_charges_setfreebycourt: number;
  no_indv_appr_ht_charges_pendingcases: number;
  is_mthly_trend_anal_report_prep: boolean;
  remarks: string;
}

interface HumanTraffickingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: HumanTraffickingFormState;
  setFormData: React.Dispatch<React.SetStateAction<HumanTraffickingFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const HumanTraffickingFormModal: React.FC<HumanTraffickingFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Human Trafficking Record',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof HumanTraffickingFormState, value: any) => {
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
                checked={formData.is_db_formed}
                onChange={(e) => handleChange('is_db_formed', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span>DB Formed</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={formData.is_mthly_trend_anal_report_prep}
                onChange={(e) => handleChange('is_mthly_trend_anal_report_prep', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span>Monthly Trend Analysis Report Prepared</span>
            </label>
          </div>
        </div>

        {/* Operations Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Operations Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="No. Operations Launched Against HT Networks"
              type="number"
              value={formData.no_ops_launch_against_ht_networks.toString()}
              onChange={(e) => handleChange('no_ops_launch_against_ht_networks', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Individuals Apprehended During Operations"
              type="number"
              value={formData.no_indv_appr_during_ops.toString()}
              onChange={(e) => handleChange('no_indv_appr_during_ops', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Individuals Neutralized During Operations"
              type="number"
              value={formData.no_indv_neut_during_ops.toString()}
              onChange={(e) => handleChange('no_indv_neut_during_ops', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
          </div>
        </div>

        {/* Court Proceedings Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Court Proceedings Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="No. Individuals Apprehended with HT Charges - Convicted"
              type="number"
              value={formData.no_indv_appr_ht_charges_convicted.toString()}
              onChange={(e) => handleChange('no_indv_appr_ht_charges_convicted', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Individuals Apprehended with HT Charges - Set Free by Court"
              type="number"
              value={formData.no_indv_appr_ht_charges_setfreebycourt.toString()}
              onChange={(e) => handleChange('no_indv_appr_ht_charges_setfreebycourt', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <div className="sm:col-span-2">
              <Input
                label="No. Individuals Apprehended with HT Charges - Pending Cases"
                type="number"
                value={formData.no_indv_appr_ht_charges_pendingcases.toString()}
                onChange={(e) => handleChange('no_indv_appr_ht_charges_pendingcases', parseInt(e.target.value) || 0)}
                disabled={viewMode}
                min="0"
              />
            </div>
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

export default HumanTraffickingFormModal;

