import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface PredictiveAnalysisDetailFormState {
  name: string;
  forwarded_to: string;
  assess_accuracy: string;
  timely_response: string;
  is_incident_averted: boolean;
  is_generated: boolean;
  remarks: string;
}

interface PredictiveAnalysisDetailFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PredictiveAnalysisDetailFormState;
  setFormData: React.Dispatch<React.SetStateAction<PredictiveAnalysisDetailFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
  loading?: boolean;
}

const PredictiveAnalysisDetailFormModal: React.FC<PredictiveAnalysisDetailFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Predictive Analysis Detail',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
  loading = false,
}) => {
  const handleChange = (field: keyof PredictiveAnalysisDetailFormState, value: string | boolean) => {
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
            <p className="text-sm text-muted-foreground">Loading predictive analysis details...</p>
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
            <label htmlFor="assess_accuracy" className="block text-sm font-medium mb-1">
              Assess Accuracy <span className="text-red-500">*</span>
            </label>
            <Input
              id="assess_accuracy"
              type="text"
              value={formData.assess_accuracy || ''}
              onChange={(e) => handleChange('assess_accuracy', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter assess accuracy"
            />
          </div>

          <div>
            <label htmlFor="timely_response" className="block text-sm font-medium mb-1">
              Timely Response <span className="text-red-500">*</span>
            </label>
            <Input
              id="timely_response"
              type="text"
              value={formData.timely_response || ''}
              onChange={(e) => handleChange('timely_response', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter timely response"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_incident_averted"
                checked={formData.is_incident_averted || false}
                onChange={(e) => handleChange('is_incident_averted', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <label htmlFor="is_incident_averted" className="text-sm font-medium">
                Incident Averted
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_generated"
                checked={formData.is_generated || false}
                onChange={(e) => handleChange('is_generated', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <label htmlFor="is_generated" className="text-sm font-medium">
                Generated
              </label>
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

export default PredictiveAnalysisDetailFormModal;

