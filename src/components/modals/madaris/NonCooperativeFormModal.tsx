import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface NonCooperativeFormState {
  role_of_institute: string;
  nature_of_non_cooperation: string;
  remarks: string;
}

interface NonCooperativeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: NonCooperativeFormState;
  setFormData: React.Dispatch<React.SetStateAction<NonCooperativeFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const NonCooperativeFormModal: React.FC<NonCooperativeFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Non Cooperative',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (field: keyof NonCooperativeFormState, value: string) => {
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
          {/* Role of Institute */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Role of Institute <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.role_of_institute}
              onChange={(e) => handleChange('role_of_institute', e.target.value)}
              placeholder="Enter role of institute"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Nature of Non Cooperation */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Nature of Non Cooperation <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.nature_of_non_cooperation}
              onChange={(e) => handleChange('nature_of_non_cooperation', e.target.value)}
              placeholder="Enter nature of non-cooperation"
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

export default NonCooperativeFormModal;

