import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface PIFTACReportFormState {
  report_name: string;
  report_type: string;
  forwarded_to: string;
  ref_no: string;
  is_feedback_recv: boolean;
  remarks: string;
}

interface PIFTACReportFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PIFTACReportFormState;
  setFormData: React.Dispatch<React.SetStateAction<PIFTACReportFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
  loading?: boolean;
}

const PIFTACReportFormModal: React.FC<PIFTACReportFormModalProps> = ({
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
  const handleChange = (field: keyof PIFTACReportFormState, value: string | boolean) => {
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
            <p className="text-sm text-muted-foreground">Loading report details...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="report_name" className="block text-sm font-medium mb-1">
              Report Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="report_name"
              type="text"
              value={formData.report_name || ''}
              onChange={(e) => handleChange('report_name', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter report name"
            />
          </div>

        <div>
          <label htmlFor="report_type" className="block text-sm font-medium mb-1">
            Report Type <span className="text-red-500">*</span>
          </label>
          <select
            id="report_type"
            value={formData.report_type || ''}
            onChange={(e) => handleChange('report_type', e.target.value)}
            disabled={viewMode}
            required
            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select report type</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annual">Annual</option>
            <option value="Special">Special</option>
          </select>
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
          <label htmlFor="ref_no" className="block text-sm font-medium mb-1">
            Reference Number <span className="text-red-500">*</span>
          </label>
          <Input
            id="ref_no"
            type="text"
            value={formData.ref_no || ''}
            onChange={(e) => handleChange('ref_no', e.target.value)}
            disabled={viewMode}
            required
            placeholder="Enter reference number"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_feedback_recv"
            checked={formData.is_feedback_recv || false}
            onChange={(e) => handleChange('is_feedback_recv', e.target.checked)}
            disabled={viewMode}
            className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
          />
          <label htmlFor="is_feedback_recv" className="text-sm font-medium">
            Feedback Received
          </label>
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

export default PIFTACReportFormModal;

