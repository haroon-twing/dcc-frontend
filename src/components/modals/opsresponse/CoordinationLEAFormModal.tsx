import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface CoordinationLEAFormState {
  lea_name: string;
  no_letters_sent: number;
  no_letters_received: number;
  no_acknowledgements: number;
  remarks: string;
}

interface CoordinationLEAFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CoordinationLEAFormState;
  setFormData: React.Dispatch<React.SetStateAction<CoordinationLEAFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
  loading?: boolean;
}

const CoordinationLEAFormModal: React.FC<CoordinationLEAFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Coordination with LEA',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
  loading = false,
}) => {
  const handleChange = (field: keyof CoordinationLEAFormState, value: string | number) => {
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
            <p className="text-sm text-muted-foreground">Loading coordination details...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="lea_name" className="block text-sm font-medium mb-1">
              Law Enforcement Agency Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="lea_name"
              type="text"
              value={formData.lea_name || ''}
              onChange={(e) => handleChange('lea_name', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter LEA name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="no_letters_sent" className="block text-sm font-medium mb-1">
                No. of Letters Sent <span className="text-red-500">*</span>
              </label>
              <Input
                id="no_letters_sent"
                type="number"
                value={formData.no_letters_sent || ''}
                onChange={(e) => handleChange('no_letters_sent', parseInt(e.target.value) || 0)}
                disabled={viewMode}
                required
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="no_letters_received" className="block text-sm font-medium mb-1">
                No. of Letters Received <span className="text-red-500">*</span>
              </label>
              <Input
                id="no_letters_received"
                type="number"
                value={formData.no_letters_received || ''}
                onChange={(e) => handleChange('no_letters_received', parseInt(e.target.value) || 0)}
                disabled={viewMode}
                required
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="no_acknowledgements" className="block text-sm font-medium mb-1">
                No. of Acknowledgements <span className="text-red-500">*</span>
              </label>
              <Input
                id="no_acknowledgements"
                type="number"
                value={formData.no_acknowledgements || ''}
                onChange={(e) => handleChange('no_acknowledgements', parseInt(e.target.value) || 0)}
                disabled={viewMode}
                required
                min="0"
                placeholder="0"
              />
            </div>
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

export default CoordinationLEAFormModal;

