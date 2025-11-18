import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface ProscribedTerroristFormState {
  to_name: string;
  location: string;
  estimate_strength: number;
  date_proscription: string;
  proscribing_authority: string;
  remarks: string;
}

interface ProscribedTerroristFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ProscribedTerroristFormState;
  setFormData: React.Dispatch<React.SetStateAction<ProscribedTerroristFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
  loading?: boolean;
}

const ProscribedTerroristFormModal: React.FC<ProscribedTerroristFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Proscribed Terrorist Organization',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
  loading = false,
}) => {
  const handleChange = (field: keyof ProscribedTerroristFormState, value: string | number) => {
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
            <p className="text-sm text-muted-foreground">Loading organization details...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="to_name" className="block text-sm font-medium mb-1">
              Organization Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="to_name"
              type="text"
              value={formData.to_name || ''}
              onChange={(e) => handleChange('to_name', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter organization name"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <Input
              id="location"
              type="text"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter location (e.g., City, Country)"
            />
          </div>

          <div>
            <label htmlFor="estimate_strength" className="block text-sm font-medium mb-1">
              Estimate Strength <span className="text-red-500">*</span>
            </label>
            <Input
              id="estimate_strength"
              type="number"
              value={formData.estimate_strength || ''}
              onChange={(e) => handleChange('estimate_strength', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              required
              min="0"
              placeholder="Enter estimate strength"
            />
          </div>

          <div>
            <label htmlFor="date_proscription" className="block text-sm font-medium mb-1">
              Date of Proscription <span className="text-red-500">*</span>
            </label>
            <Input
              id="date_proscription"
              type="date"
              value={formData.date_proscription || ''}
              onChange={(e) => handleChange('date_proscription', e.target.value)}
              disabled={viewMode}
              required
            />
          </div>

          <div>
            <label htmlFor="proscribing_authority" className="block text-sm font-medium mb-1">
              Proscribing Authority <span className="text-red-500">*</span>
            </label>
            <Input
              id="proscribing_authority"
              type="text"
              value={formData.proscribing_authority || ''}
              onChange={(e) => handleChange('proscribing_authority', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter proscribing authority"
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

export default ProscribedTerroristFormModal;

