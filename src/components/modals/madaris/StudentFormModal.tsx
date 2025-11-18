import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface StudentFormState {
  total_foreign_students: string;
  origin_country: string;
  remarks: string;
}

interface StudentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: StudentFormState;
  setFormData: React.Dispatch<React.SetStateAction<StudentFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  madarisId: string;
  viewMode?: boolean;
  countries: Array<{ _id: string; name: string }>;
  loadingCountries?: boolean;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Student',
  submitLabel = 'Save',
  submitting = false,
  madarisId,
  viewMode = false,
  countries = [],
  loadingCountries = false,
}) => {
  const handleChange = (field: keyof StudentFormState, value: string) => {
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
          {/* Total Foreign Students */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Total Foreign Students <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.total_foreign_students}
              onChange={(e) => handleChange('total_foreign_students', e.target.value)}
              placeholder="0"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
              min="0"
            />
          </div>

          {/* Origin Country */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Origin Country <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.origin_country}
              onChange={(e) => handleChange('origin_country', e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
              disabled={submitting || viewMode || loadingCountries}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.name}
                </option>
              ))}
            </select>
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

export default StudentFormModal;

