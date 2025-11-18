import React, { useEffect, useState } from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import { Loader2 } from 'lucide-react';

interface MeasuresTakenFormState {
  measure_taken: string;
  measure_taken_authority: string;
  details: string;
  remarks: string;
}

interface MeasuresTakenFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MeasuresTakenFormState) => Promise<void>;
  initialData?: MeasuresTakenFormState | null;
  isEditMode?: boolean;
  isViewMode?: boolean;
  loading?: boolean;
  submitting?: boolean;
}

const MeasuresTakenFormModal: React.FC<MeasuresTakenFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditMode = false,
  isViewMode = false,
  loading = false,
  submitting = false,
}) => {
  const [formData, setFormData] = useState<MeasuresTakenFormState>({
    measure_taken: '',
    measure_taken_authority: '',
    details: '',
    remarks: '',
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          measure_taken: initialData.measure_taken || '',
          measure_taken_authority: initialData.measure_taken_authority || '',
          details: initialData.details || '',
          remarks: initialData.remarks || '',
        });
      } else {
        setFormData({
          measure_taken: '',
          measure_taken_authority: '',
          details: '',
          remarks: '',
        });
      }
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof MeasuresTakenFormState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isDisabled = isViewMode || submitting || loading;

  const modalTitle = isViewMode ? 'View Measures Taken' : isEditMode ? 'Edit Measures Taken' : 'Add Measures Taken';
  const modalDescription = isViewMode
    ? 'View measures taken details'
    : isEditMode
    ? 'Update measures taken information'
    : 'Add a new measure taken for this Safe City project';

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
            <p className="text-muted-foreground">Loading measures taken data...</p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{modalDescription}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Measure Taken */}
            <div className="space-y-2">
              <label htmlFor="measure_taken" className="block text-sm font-medium text-foreground">
                Measure Taken <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="measure_taken"
                value={formData.measure_taken}
                onChange={(e) => handleChange('measure_taken', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter the measure taken"
                required
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Measure Taken Authority */}
            <div className="space-y-2">
              <label htmlFor="measure_taken_authority" className="block text-sm font-medium text-foreground">
                Measure Taken Authority <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="measure_taken_authority"
                value={formData.measure_taken_authority}
                onChange={(e) => handleChange('measure_taken_authority', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter the authority responsible"
                required
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Details */}
            <div className="space-y-2">
              <label htmlFor="details" className="block text-sm font-medium text-foreground">
                Details <span className="text-red-500">*</span>
              </label>
              <textarea
                id="details"
                value={formData.details}
                onChange={(e) => handleChange('details', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter detailed information about the measure"
                rows={4}
                required
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
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
                rows={3}
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
                    'Update Measures Taken'
                  ) : (
                    'Add Measures Taken'
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

export default MeasuresTakenFormModal;

