import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface SmugglingFormState {
  id?: string;
  is_db_formed: boolean;
  no_smug_apprehended: number;
  no_smug_convicted: number;
  no_appr_smug_freebycourt: number;
  no_appr_smug_casepending: number;
  is_mthly_report_formed: boolean;
  remarks: string;
}

interface SmugglingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: SmugglingFormState;
  setFormData: React.Dispatch<React.SetStateAction<SmugglingFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const SmugglingFormModal: React.FC<SmugglingFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Smuggling Record',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof SmugglingFormState, value: any) => {
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
                checked={formData.is_mthly_report_formed}
                onChange={(e) => handleChange('is_mthly_report_formed', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span>Monthly Report Formed</span>
            </label>
          </div>
        </div>

        {/* Smuggler Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Smuggler Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="No. Smugglers Apprehended"
              type="number"
              value={formData.no_smug_apprehended.toString()}
              onChange={(e) => handleChange('no_smug_apprehended', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Smugglers Convicted"
              type="number"
              value={formData.no_smug_convicted.toString()}
              onChange={(e) => handleChange('no_smug_convicted', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Apprehended Smugglers Freed by Court"
              type="number"
              value={formData.no_appr_smug_freebycourt.toString()}
              onChange={(e) => handleChange('no_appr_smug_freebycourt', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Apprehended Smugglers Cases Pending"
              type="number"
              value={formData.no_appr_smug_casepending.toString()}
              onChange={(e) => handleChange('no_appr_smug_casepending', parseInt(e.target.value) || 0)}
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

export default SmugglingFormModal;

