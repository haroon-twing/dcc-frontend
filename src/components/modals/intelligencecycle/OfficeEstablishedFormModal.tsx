import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface OfficeEstablishedFormState {
  name: string;
  rank: string;
  appointment: string;
  contact_no: string;
  remarks: string;
}

interface OfficeEstablishedFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: OfficeEstablishedFormState;
  setFormData: React.Dispatch<React.SetStateAction<OfficeEstablishedFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
  loading?: boolean;
}

const OfficeEstablishedFormModal: React.FC<OfficeEstablishedFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Office Established',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
  loading = false,
}) => {
  const handleChange = (field: keyof OfficeEstablishedFormState, value: string) => {
    if (viewMode) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="xl">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading office details...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter Office name"
            />
          </div>

          <div>
            <label htmlFor="rank" className="block text-sm font-medium mb-1">
              Rank <span className="text-red-500">*</span>
            </label>
            <Input
              id="rank"
              type="text"
              value={formData.rank || ''}
              onChange={(e) => handleChange('rank', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter rank"
            />
          </div>

          <div>
            <label htmlFor="appointment" className="block text-sm font-medium mb-1">
              Appointment <span className="text-red-500">*</span>
            </label>
            <Input
              id="appointment"
              type="text"
              value={formData.appointment || ''}
              onChange={(e) => handleChange('appointment', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter appointment"
            />
          </div>

          <div>
            <label htmlFor="contact_no" className="block text-sm font-medium mb-1">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="contact_no"
              type="text"
              value={formData.contact_no || ''}
              onChange={(e) => handleChange('contact_no', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter contact number"
            />
          </div>

          <div>
            <label htmlFor="remarks" className="block text-sm font-medium mb-1">
              Remarks
            </label>
            <textarea
              id="remarks"
              value={formData.remarks || ''}
              onChange={(e) => handleChange('remarks', e.target.value)}
              disabled={viewMode}
              rows={4}
              placeholder="Enter remarks (optional)"
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
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
      )}
    </Modal>
  );
};

export default OfficeEstablishedFormModal;

