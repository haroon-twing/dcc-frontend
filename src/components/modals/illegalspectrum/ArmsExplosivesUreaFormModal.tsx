import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface ArmsExplosivesUreaFormState {
  id?: string;
  per_change_arms_inflow: number;
  per_change_explosive_inflow: number;
  per_change_illegal_urea_transportation: number;
  no_int_reports_shared_lea: number;
  no_letter_recvd_in_fdbk: number;
  per_recs_made_illegal_arms: number;
  is_recs_faster_than_mthly_inflow_ill_arms: boolean;
  per_recs_made_illegal_explosives: number;
  is_recs_faster_than_mthly_inflow_ill_exp: boolean;
  per_recs_made_illegal_urea: number;
  is_recs_faster_than_mthly_inflow_ill_urea: boolean;
  no_perpetrator_convicted: number;
  no_appreh_perp_set_freebycourt: number;
  no_perpetrator_case_remain_pending: number;
}

interface ArmsExplosivesUreaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ArmsExplosivesUreaFormState;
  setFormData: React.Dispatch<React.SetStateAction<ArmsExplosivesUreaFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const ArmsExplosivesUreaFormModal: React.FC<ArmsExplosivesUreaFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Arms / Explosives and Illegal Urea Record',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof ArmsExplosivesUreaFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="xl">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1 max-h-[80vh] overflow-y-auto">
        {/* Percentage Changes */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Percentage Changes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="% Change Arms Inflow"
              type="number"
              step="0.1"
              value={formData.per_change_arms_inflow.toString()}
              onChange={(e) => handleChange('per_change_arms_inflow', parseFloat(e.target.value) || 0)}
              disabled={viewMode}
            />
            <Input
              label="% Change Explosive Inflow"
              type="number"
              step="0.1"
              value={formData.per_change_explosive_inflow.toString()}
              onChange={(e) => handleChange('per_change_explosive_inflow', parseFloat(e.target.value) || 0)}
              disabled={viewMode}
            />
            <Input
              label="% Change Illegal Urea Transportation"
              type="number"
              step="0.1"
              value={formData.per_change_illegal_urea_transportation.toString()}
              onChange={(e) => handleChange('per_change_illegal_urea_transportation', parseFloat(e.target.value) || 0)}
              disabled={viewMode}
            />
          </div>
        </div>

        {/* Reports and Letters */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Reports and Letters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="No. Intelligence Reports Shared with LEA"
              type="number"
              value={formData.no_int_reports_shared_lea.toString()}
              onChange={(e) => handleChange('no_int_reports_shared_lea', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Letters Received in Feedback"
              type="number"
              value={formData.no_letter_recvd_in_fdbk.toString()}
              onChange={(e) => handleChange('no_letter_recvd_in_fdbk', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
          </div>
        </div>

        {/* Recoveries - Arms */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Recoveries - Arms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="% Recoveries Made Illegal Arms"
              type="number"
              step="0.1"
              value={formData.per_recs_made_illegal_arms.toString()}
              onChange={(e) => handleChange('per_recs_made_illegal_arms', parseFloat(e.target.value) || 0)}
              disabled={viewMode}
            />
            <div>
              <label className="flex items-center space-x-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={formData.is_recs_faster_than_mthly_inflow_ill_arms}
                  onChange={(e) => handleChange('is_recs_faster_than_mthly_inflow_ill_arms', e.target.checked)}
                  disabled={viewMode}
                  className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
                />
                <span>Recoveries Faster Than Monthly Inflow (Arms)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Recoveries - Explosives */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Recoveries - Explosives</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="% Recoveries Made Illegal Explosives"
              type="number"
              step="0.1"
              value={formData.per_recs_made_illegal_explosives.toString()}
              onChange={(e) => handleChange('per_recs_made_illegal_explosives', parseFloat(e.target.value) || 0)}
              disabled={viewMode}
            />
            <div>
              <label className="flex items-center space-x-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={formData.is_recs_faster_than_mthly_inflow_ill_exp}
                  onChange={(e) => handleChange('is_recs_faster_than_mthly_inflow_ill_exp', e.target.checked)}
                  disabled={viewMode}
                  className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
                />
                <span>Recoveries Faster Than Monthly Inflow (Explosives)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Recoveries - Urea */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Recoveries - Urea</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="% Recoveries Made Illegal Urea"
              type="number"
              step="0.1"
              value={formData.per_recs_made_illegal_urea.toString()}
              onChange={(e) => handleChange('per_recs_made_illegal_urea', parseFloat(e.target.value) || 0)}
              disabled={viewMode}
            />
            <div>
              <label className="flex items-center space-x-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={formData.is_recs_faster_than_mthly_inflow_ill_urea}
                  onChange={(e) => handleChange('is_recs_faster_than_mthly_inflow_ill_urea', e.target.checked)}
                  disabled={viewMode}
                  className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
                />
                <span>Recoveries Faster Than Monthly Inflow (Urea)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Perpetrator Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Perpetrator Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="No. Perpetrators Convicted"
              type="number"
              value={formData.no_perpetrator_convicted.toString()}
              onChange={(e) => handleChange('no_perpetrator_convicted', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Apprehended Perpetrators Set Free by Court"
              type="number"
              value={formData.no_appreh_perp_set_freebycourt.toString()}
              onChange={(e) => handleChange('no_appreh_perp_set_freebycourt', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Perpetrator Cases Remaining Pending"
              type="number"
              value={formData.no_perpetrator_case_remain_pending.toString()}
              onChange={(e) => handleChange('no_perpetrator_case_remain_pending', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
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

export default ArmsExplosivesUreaFormModal;

