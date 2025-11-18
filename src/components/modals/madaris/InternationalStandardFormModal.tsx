import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface InternationalStandardFormState {
  authority_qualifies: string;
  date_of_acceptance: string;
  remarks: string;
}

interface InternationalStandardFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: InternationalStandardFormState;
  setFormData: React.Dispatch<React.SetStateAction<InternationalStandardFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  madarisId: string;
  viewMode?: boolean;
}

const InternationalStandardFormModal: React.FC<InternationalStandardFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add International Standard',
  submitLabel = 'Save',
  submitting = false,
  madarisId,
  viewMode = false,
}) => {
  const handleChange = (field: keyof InternationalStandardFormState, value: string) => {
    if (viewMode) return; // Prevent changes in view mode
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

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch {
      return dateString;
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
          {/* Authority Qualifies */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Authority Qualifies <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.authority_qualifies}
              onChange={(e) => handleChange('authority_qualifies', e.target.value)}
              placeholder="e.g., International Education Board"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Date of Acceptance */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Date of Acceptance <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formatDateForInput(formData.date_of_acceptance)}
              onChange={(e) => handleChange('date_of_acceptance', e.target.value)}
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
              placeholder="Enter remarks..."
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

export default InternationalStandardFormModal;

