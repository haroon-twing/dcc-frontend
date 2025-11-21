import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface FundingSourceFormState {
  source_name: string;
  source_type: string;
  funding_purpose: string;
  remarks: string;
}

interface FundingSourceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FundingSourceFormState;
  setFormData: React.Dispatch<React.SetStateAction<FundingSourceFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const FundingSourceFormModal: React.FC<FundingSourceFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Funding Source',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (field: keyof FundingSourceFormState, value: string) => {
    if (viewMode) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    if (!submitting) {
      onOpenChange(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={title}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Source Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.source_name}
              onChange={(e) => handleChange('source_name', e.target.value)}
              placeholder="Enter source name"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Source Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Source Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.source_type}
              onChange={(e) => handleChange('source_type', e.target.value)}
              required
              disabled={submitting || viewMode}
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select source type</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="NGO">NGO</option>
            </select>
          </div>

          {/* Funding Purpose */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Funding Purpose <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.funding_purpose}
              onChange={(e) => handleChange('funding_purpose', e.target.value)}
              placeholder="e.g., Infrastructure Development"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Additional notes or comments"
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-y"
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          {viewMode ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : submitLabel}
              </Button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default FundingSourceFormModal;

