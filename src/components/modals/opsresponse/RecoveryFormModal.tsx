import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface RecoveryFormState {
  type: string;
  qty_recovered: number;
  remarks: string;
}

interface RecoveryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: RecoveryFormState;
  setFormData: React.Dispatch<React.SetStateAction<RecoveryFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
  loading?: boolean;
}

const RecoveryFormModal: React.FC<RecoveryFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Recovery',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
  loading = false,
}) => {
  const handleChange = (field: keyof RecoveryFormState, value: string | number) => {
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
            <p className="text-sm text-muted-foreground">Loading recovery details...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <Input
              id="type"
              type="text"
              value={formData.type || ''}
              onChange={(e) => handleChange('type', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter type (e.g., weapons, ammunition, etc.)"
            />
          </div>

          <div>
            <label htmlFor="qty_recovered" className="block text-sm font-medium mb-1">
              Quantity Recovered <span className="text-red-500">*</span>
            </label>
            <Input
              id="qty_recovered"
              type="number"
              value={formData.qty_recovered || ''}
              onChange={(e) => handleChange('qty_recovered', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              required
              min="0"
              placeholder="0"
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

export default RecoveryFormModal;

