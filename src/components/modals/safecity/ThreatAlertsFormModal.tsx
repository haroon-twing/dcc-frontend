import React, { useEffect, useState } from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import { Loader2 } from 'lucide-react';

interface ThreatAlertsFormState {
  no_of_ta_issued: number;
  no_of_actions_taken: number;
  remarks: string;
}

interface ThreatAlertsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ThreatAlertsFormState) => Promise<void>;
  initialData?: ThreatAlertsFormState | null;
  isEditMode?: boolean;
  isViewMode?: boolean;
  loading?: boolean;
  submitting?: boolean;
}

const ThreatAlertsFormModal: React.FC<ThreatAlertsFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditMode = false,
  isViewMode = false,
  loading = false,
  submitting = false,
}) => {
  const [formData, setFormData] = useState<ThreatAlertsFormState>({
    no_of_ta_issued: 0,
    no_of_actions_taken: 0,
    remarks: '',
  });

  // Local string states for number inputs to allow empty values
  const [taIssuedInput, setTaIssuedInput] = useState<string>('');
  const [actionsTakenInput, setActionsTakenInput] = useState<string>('');

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          no_of_ta_issued: initialData.no_of_ta_issued ?? 0,
          no_of_actions_taken: initialData.no_of_actions_taken ?? 0,
          remarks: initialData.remarks || '',
        });
        // Display the actual number value, including 0
        // Use nullish coalescing to handle 0 correctly
        const taIssued = initialData.no_of_ta_issued ?? 0;
        const actionsTaken = initialData.no_of_actions_taken ?? 0;
        setTaIssuedInput(String(taIssued));
        setActionsTakenInput(String(actionsTaken));
      } else {
        setFormData({
          no_of_ta_issued: 0,
          no_of_actions_taken: 0,
          remarks: '',
        });
        setTaIssuedInput('');
        setActionsTakenInput('');
      }
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that required fields are not empty
    if (!taIssuedInput.trim() || !actionsTakenInput.trim()) {
      window.alert('Please fill in all required fields.');
      return;
    }

    // Convert string inputs to numbers before submitting
    const taIssuedNum = parseInt(taIssuedInput.trim());
    const actionsTakenNum = parseInt(actionsTakenInput.trim());

    // Validate that the parsed values are valid numbers
    if (isNaN(taIssuedNum) || isNaN(actionsTakenNum)) {
      window.alert('Please enter valid numbers for all required fields.');
      return;
    }

    const submitData: ThreatAlertsFormState = {
      no_of_ta_issued: taIssuedNum,
      no_of_actions_taken: actionsTakenNum,
      remarks: formData.remarks,
    };
    
    await onSubmit(submitData);
  };

  const handleChange = (field: keyof ThreatAlertsFormState, value: number | string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberChange = (field: 'no_of_ta_issued' | 'no_of_actions_taken', value: string) => {
    // Allow empty string or valid numbers
    if (value === '' || /^\d*$/.test(value)) {
      if (field === 'no_of_ta_issued') {
        setTaIssuedInput(value);
      } else {
        setActionsTakenInput(value);
      }
    }
  };

  const isDisabled = isViewMode || submitting || loading;

  const modalTitle = isViewMode ? 'View Threat Alerts' : isEditMode ? 'Edit Threat Alerts' : 'Add Threat Alerts';
  const modalDescription = isViewMode
    ? 'View threat alerts details'
    : isEditMode
    ? 'Update threat alerts information'
    : 'Add a new threat alerts record for this Safe City project';

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
            <p className="text-muted-foreground">Loading threat alerts data...</p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{modalDescription}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Number of TA Issued */}
            <div className="space-y-2">
              <label htmlFor="no_of_ta_issued" className="block text-sm font-medium text-foreground">
                Number of TA Issued <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="no_of_ta_issued"
                value={taIssuedInput}
                onChange={(e) => handleNumberChange('no_of_ta_issued', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter number of TA issued"
                required={!isViewMode}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Number of Actions Taken */}
            <div className="space-y-2">
              <label htmlFor="no_of_actions_taken" className="block text-sm font-medium text-foreground">
                Number of Actions Taken <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="no_of_actions_taken"
                value={actionsTakenInput}
                onChange={(e) => handleNumberChange('no_of_actions_taken', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter number of actions taken"
                required={!isViewMode}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    'Update Threat Alerts'
                  ) : (
                    'Add Threat Alerts'
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

export default ThreatAlertsFormModal;

