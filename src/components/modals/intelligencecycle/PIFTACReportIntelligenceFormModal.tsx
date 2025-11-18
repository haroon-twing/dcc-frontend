import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface PIFTACReportIntelligenceFormState {
  name: string;
  type: string;
  category: string;
  forwarded_to: string;
  reference_no: string;
  remarks: string;
}

interface PIFTACReportIntelligenceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PIFTACReportIntelligenceFormState;
  setFormData: React.Dispatch<React.SetStateAction<PIFTACReportIntelligenceFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
  loading?: boolean;
}

const PIFTACReportIntelligenceFormModal: React.FC<PIFTACReportIntelligenceFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add PIFTAC Report',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
  loading = false,
}) => {
  const handleChange = (field: keyof PIFTACReportIntelligenceFormState, value: string) => {
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
            <p className="text-sm text-muted-foreground">Loading PIFTAC report details...</p>
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
              placeholder="Enter report name"
            />
          </div>

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
              placeholder="Enter report type"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <Input
              id="category"
              type="text"
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter category"
            />
          </div>

          <div>
            <label htmlFor="forwarded_to" className="block text-sm font-medium mb-1">
              Forwarded To <span className="text-red-500">*</span>
            </label>
            <Input
              id="forwarded_to"
              type="text"
              value={formData.forwarded_to || ''}
              onChange={(e) => handleChange('forwarded_to', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter forwarded to"
            />
          </div>

          <div>
            <label htmlFor="reference_no" className="block text-sm font-medium mb-1">
              Reference No <span className="text-red-500">*</span>
            </label>
            <Input
              id="reference_no"
              type="text"
              value={formData.reference_no || ''}
              onChange={(e) => handleChange('reference_no', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter reference number"
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

export default PIFTACReportIntelligenceFormModal;

