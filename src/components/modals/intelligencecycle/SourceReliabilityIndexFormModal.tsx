import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface SourceReliabilityIndexFormState {
  source: string;
  intl_recvd_month: string;
  source_reliability: string;
  info_credibility: string;
  remarks: string;
}

interface SourceReliabilityIndexFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: SourceReliabilityIndexFormState;
  setFormData: React.Dispatch<React.SetStateAction<SourceReliabilityIndexFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
  loading?: boolean;
}

const SourceReliabilityIndexFormModal: React.FC<SourceReliabilityIndexFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Source Reliability Index',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
  loading = false,
}) => {
  const handleChange = (field: keyof SourceReliabilityIndexFormState, value: string) => {
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
            <p className="text-sm text-muted-foreground">Loading source reliability details...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="source" className="block text-sm font-medium mb-1">
              Source <span className="text-red-500">*</span>
            </label>
            <Input
              id="source"
              type="text"
              value={formData.source || ''}
              onChange={(e) => handleChange('source', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter source"
            />
          </div>

          <div>
            <label htmlFor="intl_recvd_month" className="block text-sm font-medium mb-1">
              Intelligence Received Month <span className="text-red-500">*</span>
            </label>
            <Input
              id="intl_recvd_month"
              type="text"
              value={formData.intl_recvd_month || ''}
              onChange={(e) => handleChange('intl_recvd_month', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter intelligence received month"
            />
          </div>

          <div>
            <label htmlFor="source_reliability" className="block text-sm font-medium mb-1">
              Source Reliability <span className="text-red-500">*</span>
            </label>
            <Input
              id="source_reliability"
              type="text"
              value={formData.source_reliability || ''}
              onChange={(e) => handleChange('source_reliability', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter source reliability"
            />
          </div>

          <div>
            <label htmlFor="info_credibility" className="block text-sm font-medium mb-1">
              Information Credibility <span className="text-red-500">*</span>
            </label>
            <Input
              id="info_credibility"
              type="text"
              value={formData.info_credibility || ''}
              onChange={(e) => handleChange('info_credibility', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter information credibility"
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

export default SourceReliabilityIndexFormModal;

