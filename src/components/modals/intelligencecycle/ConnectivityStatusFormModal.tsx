import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface ConnectivityStatusFormState {
  office: string;
  is_nip_access: boolean;
  is_eoffice_access: boolean;
  is_oas_access: boolean;
  is_internet_access: boolean;
  remarks: string;
}

interface ConnectivityStatusFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ConnectivityStatusFormState;
  setFormData: React.Dispatch<React.SetStateAction<ConnectivityStatusFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
  loading?: boolean;
}

const ConnectivityStatusFormModal: React.FC<ConnectivityStatusFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Connectivity Status',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
  loading = false,
}) => {
  const handleChange = (field: keyof ConnectivityStatusFormState, value: string | boolean) => {
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
            <p className="text-sm text-muted-foreground">Loading connectivity status details...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="office" className="block text-sm font-medium mb-1">
              Office <span className="text-red-500">*</span>
            </label>
            <Input
              id="office"
              type="text"
              value={formData.office || ''}
              onChange={(e) => handleChange('office', e.target.value)}
              disabled={viewMode}
              required
              placeholder="Enter office name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_nip_access"
                checked={formData.is_nip_access || false}
                onChange={(e) => handleChange('is_nip_access', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <label htmlFor="is_nip_access" className="text-sm font-medium">
                NIP Access
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_eoffice_access"
                checked={formData.is_eoffice_access || false}
                onChange={(e) => handleChange('is_eoffice_access', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <label htmlFor="is_eoffice_access" className="text-sm font-medium">
                E-Office Access
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_oas_access"
                checked={formData.is_oas_access || false}
                onChange={(e) => handleChange('is_oas_access', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <label htmlFor="is_oas_access" className="text-sm font-medium">
                OAS Access
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_internet_access"
                checked={formData.is_internet_access || false}
                onChange={(e) => handleChange('is_internet_access', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <label htmlFor="is_internet_access" className="text-sm font-medium">
                Internet Access
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

export default ConnectivityStatusFormModal;

