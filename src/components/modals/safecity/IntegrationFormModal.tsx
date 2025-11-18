import React, { useEffect, useState } from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import { Loader2 } from 'lucide-react';

interface IntegrationFormState {
  integ_with_dcc: boolean;
  integ_with_piftac: boolean;
  integ_with_niftac: boolean;
  remarks: string;
}

interface IntegrationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: IntegrationFormState) => Promise<void>;
  initialData?: IntegrationFormState | null;
  isEditMode?: boolean;
  isViewMode?: boolean;
  loading?: boolean;
  submitting?: boolean;
}

const IntegrationFormModal: React.FC<IntegrationFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditMode = false,
  isViewMode = false,
  loading = false,
  submitting = false,
}) => {
  const [formData, setFormData] = useState<IntegrationFormState>({
    integ_with_dcc: false,
    integ_with_piftac: false,
    integ_with_niftac: false,
    remarks: '',
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          integ_with_dcc: initialData.integ_with_dcc || false,
          integ_with_piftac: initialData.integ_with_piftac || false,
          integ_with_niftac: initialData.integ_with_niftac || false,
          remarks: initialData.remarks || '',
        });
      } else {
        setFormData({
          integ_with_dcc: false,
          integ_with_piftac: false,
          integ_with_niftac: false,
          remarks: '',
        });
      }
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof IntegrationFormState, value: boolean | string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isDisabled = isViewMode || submitting || loading;

  const modalTitle = isViewMode ? 'View Integration' : isEditMode ? 'Edit Integration' : 'Add Integration';
  const modalDescription = isViewMode
    ? 'View integration details'
    : isEditMode
    ? 'Update integration information'
    : 'Add a new integration for this Safe City project';

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={modalTitle}
      size="lg"
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading integration data...</p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{modalDescription}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Integration with DCC */}
            <div className="space-y-2">
              <label htmlFor="integ_with_dcc" className="block text-sm font-medium text-foreground">
                Integration with DCC <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="integ_with_dcc"
                  checked={formData.integ_with_dcc}
                  onChange={(e) => handleChange('integ_with_dcc', e.target.checked)}
                  disabled={isDisabled}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label htmlFor="integ_with_dcc" className="text-sm text-muted-foreground">
                  {formData.integ_with_dcc ? 'Yes' : 'No'}
                </label>
              </div>
            </div>

            {/* Integration with PIFTAC */}
            <div className="space-y-2">
              <label htmlFor="integ_with_piftac" className="block text-sm font-medium text-foreground">
                Integration with PIFTAC <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="integ_with_piftac"
                  checked={formData.integ_with_piftac}
                  onChange={(e) => handleChange('integ_with_piftac', e.target.checked)}
                  disabled={isDisabled}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label htmlFor="integ_with_piftac" className="text-sm text-muted-foreground">
                  {formData.integ_with_piftac ? 'Yes' : 'No'}
                </label>
              </div>
            </div>

            {/* Integration with NIFTAC */}
            <div className="space-y-2">
              <label htmlFor="integ_with_niftac" className="block text-sm font-medium text-foreground">
                Integration with NIFTAC <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="integ_with_niftac"
                  checked={formData.integ_with_niftac}
                  onChange={(e) => handleChange('integ_with_niftac', e.target.checked)}
                  disabled={isDisabled}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label htmlFor="integ_with_niftac" className="text-sm text-muted-foreground">
                  {formData.integ_with_niftac ? 'Yes' : 'No'}
                </label>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <label htmlFor="remarks" className="block text-sm font-medium text-foreground">
                Remarks
              </label>
              <textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter any additional remarks..."
                rows={4}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            {!isViewMode && (
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Adding...'}
                    </>
                  ) : isEditMode ? (
                    'Update Integration'
                  ) : (
                    'Add Integration'
                  )}
                </Button>
              </div>
            )}

            {isViewMode && (
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            )}
          </form>
        </>
      )}
    </Modal>
  );
};

export default IntegrationFormModal;

