import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface VerifiedCaseFormState {
  recomm_by: string;
  recomm_date: string;
  action_taken: string;
  remarks: string;
  case_reference: string;
  status: string;
}

interface VerifiedCaseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: VerifiedCaseFormState;
  setFormData: React.Dispatch<React.SetStateAction<VerifiedCaseFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const VerifiedCaseFormModal: React.FC<VerifiedCaseFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Verified Case',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (field: keyof VerifiedCaseFormState, value: string) => {
    if (viewMode) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="case_reference" className="block text-sm font-medium mb-1">
            Case Reference <span className="text-red-500">*</span>
          </label>
          <Input
            id="case_reference"
            type="text"
            value={formData.case_reference}
            onChange={(e) => handleChange('case_reference', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter case reference (e.g., MOI-2024-001)"
          />
        </div>

        <div>
          <label htmlFor="recomm_by" className="block text-sm font-medium mb-1">
            Recommended By <span className="text-red-500">*</span>
          </label>
          <Input
            id="recomm_by"
            type="text"
            value={formData.recomm_by}
            onChange={(e) => handleChange('recomm_by', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter recommending authority (e.g., Ministry of Interior)"
          />
        </div>

        <div>
          <label htmlFor="recomm_date" className="block text-sm font-medium mb-1">
            Recommendation Date <span className="text-red-500">*</span>
          </label>
          <Input
            id="recomm_date"
            type="date"
            value={formData.recomm_date ? formData.recomm_date.split('T')[0] : ''}
            onChange={(e) => {
              const dateValue = e.target.value ? `${e.target.value}T00:00:00` : '';
              handleChange('recomm_date', dateValue);
            }}
            required
            disabled={viewMode}
          />
        </div>

        <div>
          <label htmlFor="action_taken" className="block text-sm font-medium mb-1">
            Action Taken <span className="text-red-500">*</span>
          </label>
          <Input
            id="action_taken"
            type="text"
            value={formData.action_taken}
            onChange={(e) => handleChange('action_taken', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter action taken"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            required
            disabled={viewMode}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div>
          <label htmlFor="remarks" className="block text-sm font-medium mb-1">
            Remarks
          </label>
          <textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            disabled={viewMode}
            placeholder="Enter remarks (optional)"
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {!viewMode && (
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
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
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
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

export default VerifiedCaseFormModal;

