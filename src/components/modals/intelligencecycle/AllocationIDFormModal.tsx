import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface AllocationIDFormState {
  office: string;
  name: string;
  appointment: string;
  application: string;
  portal_id: string;
  remarks: string;
}

interface AllocationIDFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: AllocationIDFormState;
  setFormData: React.Dispatch<React.SetStateAction<AllocationIDFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
  loading?: boolean;
}

const AllocationIDFormModal: React.FC<AllocationIDFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Allocation ID',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
  loading = false,
}) => {
  const handleChange = (field: keyof AllocationIDFormState, value: string) => {
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
            <p className="text-sm text-muted-foreground">Loading allocation ID details...</p>
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
              placeholder="Enter name"
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
            <label htmlFor="application" className="block text-sm font-medium mb-1">
              Application <span className="text-red-500">*</span>
            </label>
            <Input
              id="application"
              type="text"
              value={formData.application || ''}
              onChange={(e) => handleChange('application', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter application"
            />
          </div>

          <div>
            <label htmlFor="portal_id" className="block text-sm font-medium mb-1">
              Portal ID <span className="text-red-500">*</span>
            </label>
            <Input
              id="portal_id"
              type="text"
              value={formData.portal_id || ''}
              onChange={(e) => handleChange('portal_id', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter portal ID"
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

export default AllocationIDFormModal;

