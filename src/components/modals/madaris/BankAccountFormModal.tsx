import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface BankAccountFormState {
  bank_name: string;
  acc_no: string;
  acc_title: string;
  branch_code: string;
  branch_address: string;
  remarks: string;
}

interface BankAccountFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: BankAccountFormState;
  setFormData: React.Dispatch<React.SetStateAction<BankAccountFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  madarisId: string;
  viewMode?: boolean;
}

const BankAccountFormModal: React.FC<BankAccountFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Bank Account',
  submitLabel = 'Save',
  submitting = false,
  madarisId,
  viewMode = false,
}) => {
  const handleChange = (field: keyof BankAccountFormState, value: string) => {
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

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={title}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.bank_name}
              onChange={(e) => handleChange('bank_name', e.target.value)}
              placeholder="e.g., National Bank of Pakistan"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Account Number <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.acc_no}
              onChange={(e) => handleChange('acc_no', e.target.value)}
              placeholder="e.g., 1234567890"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Account Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Account Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.acc_title}
              onChange={(e) => handleChange('acc_title', e.target.value)}
              placeholder="e.g., Madrasa Al-Huda Trust"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Branch Code */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Branch Code <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.branch_code}
              onChange={(e) => handleChange('branch_code', e.target.value)}
              placeholder="e.g., 1234"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Branch Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Branch Address <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.branch_address}
              onChange={(e) => handleChange('branch_address', e.target.value)}
              placeholder="e.g., Main Branch, Lahore"
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

export default BankAccountFormModal;

