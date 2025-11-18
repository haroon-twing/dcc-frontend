import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface VocationalSkillFormState {
  voc_skill_offered: string;
  age_group_offered: string;
  remarks: string;
}

interface VocationalSkillFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: VocationalSkillFormState;
  setFormData: React.Dispatch<React.SetStateAction<VocationalSkillFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  madarisId: string;
  viewMode?: boolean;
}

const VocationalSkillFormModal: React.FC<VocationalSkillFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Vocational Skill',
  submitLabel = 'Save',
  submitting = false,
  madarisId,
  viewMode = false,
}) => {
  const handleChange = (field: keyof VocationalSkillFormState, value: string) => {
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
          {/* Vocational Skill Offered */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Vocational Skill Offered <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.voc_skill_offered}
              onChange={(e) => handleChange('voc_skill_offered', e.target.value)}
              placeholder="e.g., Tailoring"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Age Group Offered */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Age Group Offered <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.age_group_offered}
              onChange={(e) => handleChange('age_group_offered', e.target.value)}
              placeholder="e.g., 15-25 years"
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

export default VocationalSkillFormModal;

