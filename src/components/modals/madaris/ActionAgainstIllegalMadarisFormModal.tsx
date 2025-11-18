import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface ActionAgainstIllegalMadarisFormState {
  name: string;
  role_of_institute: string;
  what_action_taken: string;
  date_of_action_taken: string;
  remarks: string;
}

interface ActionAgainstIllegalMadarisFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ActionAgainstIllegalMadarisFormState;
  setFormData: React.Dispatch<React.SetStateAction<ActionAgainstIllegalMadarisFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const ActionAgainstIllegalMadarisFormModal: React.FC<ActionAgainstIllegalMadarisFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Action Against Illegal Madaris',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (field: keyof ActionAgainstIllegalMadarisFormState, value: string) => {
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter name"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

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

          {/* What Action Taken */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              What Action Taken <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.what_action_taken}
              onChange={(e) => handleChange('what_action_taken', e.target.value)}
              placeholder="Enter action taken"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Date of Action Taken */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Date of Action Taken <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.date_of_action_taken}
              onChange={(e) => handleChange('date_of_action_taken', e.target.value)}
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

export default ActionAgainstIllegalMadarisFormModal;

