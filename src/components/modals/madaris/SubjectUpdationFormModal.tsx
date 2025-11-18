import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface SubjectUpdationFormState {
  subject: string;
  chap_no: string;
  updated_on_date: string;
  updated_for_class: string;
  updated_for_age_group: string;
  remarks: string;
}

interface SubjectUpdationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: SubjectUpdationFormState;
  setFormData: React.Dispatch<React.SetStateAction<SubjectUpdationFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const SubjectUpdationFormModal: React.FC<SubjectUpdationFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Subject Updation',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (field: keyof SubjectUpdationFormState, value: string) => {
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
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="Enter subject name"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Chapter No */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Chapter No <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.chap_no}
              onChange={(e) => handleChange('chap_no', e.target.value)}
              placeholder="e.g., Chapter 1"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Updated On Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Updated On Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.updated_on_date}
              onChange={(e) => handleChange('updated_on_date', e.target.value)}
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Updated For Class */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Updated For Class <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.updated_for_class}
              onChange={(e) => handleChange('updated_for_class', e.target.value)}
              placeholder="e.g., Class 5"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Updated For Age Group */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Updated For Age Group <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.updated_for_age_group}
              onChange={(e) => handleChange('updated_for_age_group', e.target.value)}
              placeholder="e.g., 10-11 years"
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

export default SubjectUpdationFormModal;

