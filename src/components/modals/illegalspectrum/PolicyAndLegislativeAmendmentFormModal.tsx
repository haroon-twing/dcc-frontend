import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { PolicyAndLegislativeAmendmentFormState } from '../../illegalspectrum/PolicyAndLegislativeAmendments';

interface PolicyAndLegislativeAmendmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PolicyAndLegislativeAmendmentFormState;
  setFormData: React.Dispatch<React.SetStateAction<PolicyAndLegislativeAmendmentFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const PolicyAndLegislativeAmendmentFormModal: React.FC<PolicyAndLegislativeAmendmentFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Policy and Legislative Amendment',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof PolicyAndLegislativeAmendmentFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="xl">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1 max-h-[80vh] overflow-y-auto">
        <Input
          label="Executive Order Name"
          value={formData.name_executive_order}
          onChange={(e) => handleChange('name_executive_order', e.target.value)}
          disabled={viewMode}
          required
        />
        <Input
          label="Area Focus"
          value={formData.area_focus}
          onChange={(e) => handleChange('area_focus', e.target.value)}
          disabled={viewMode}
        />
        <Input
          label="Location Affected"
          value={formData.location_affected}
          onChange={(e) => handleChange('location_affected', e.target.value)}
          disabled={viewMode}
        />
        <Input
          label="Passed By"
          value={formData.passed_by}
          onChange={(e) => handleChange('passed_by', e.target.value)}
          disabled={viewMode}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Passed On"
            type="date"
            value={formData.passed_on}
            onChange={(e) => handleChange('passed_on', e.target.value)}
            disabled={viewMode}
          />
          <Input
            label="Expires On"
            type="date"
            value={formData.expires_on}
            onChange={(e) => handleChange('expires_on', e.target.value)}
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

export default PolicyAndLegislativeAmendmentFormModal;

