import React, { useEffect, useState } from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import { Loader2 } from 'lucide-react';

interface PoliceStationConnectivityFormState {
  no_of_ps_connected: number;
  no_of_ps_unconnected: number;
  remarks: string;
}

interface PoliceStationConnectivityFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PoliceStationConnectivityFormState) => Promise<void>;
  initialData?: PoliceStationConnectivityFormState | null;
  isEditMode?: boolean;
  isViewMode?: boolean;
  loading?: boolean;
  submitting?: boolean;
}

const PoliceStationConnectivityFormModal: React.FC<PoliceStationConnectivityFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditMode = false,
  isViewMode = false,
  loading = false,
  submitting = false,
}) => {
  const [formData, setFormData] = useState<PoliceStationConnectivityFormState>({
    no_of_ps_connected: 0,
    no_of_ps_unconnected: 0,
    remarks: '',
  });

  // Local string states for number inputs to allow empty values
  const [connectedInput, setConnectedInput] = useState<string>('');
  const [unconnectedInput, setUnconnectedInput] = useState<string>('');

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          no_of_ps_connected: initialData.no_of_ps_connected ?? 0,
          no_of_ps_unconnected: initialData.no_of_ps_unconnected ?? 0,
          remarks: initialData.remarks || '',
        });
        // Display the actual number value, including 0
        const connected = initialData.no_of_ps_connected ?? 0;
        const unconnected = initialData.no_of_ps_unconnected ?? 0;
        setConnectedInput(String(connected));
        setUnconnectedInput(String(unconnected));
      } else {
        setFormData({
          no_of_ps_connected: 0,
          no_of_ps_unconnected: 0,
          remarks: '',
        });
        setConnectedInput('');
        setUnconnectedInput('');
      }
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that required fields are not empty
    if (!connectedInput.trim() || !unconnectedInput.trim()) {
      window.alert('Please fill in all required fields.');
      return;
    }

    // Convert string inputs to numbers before submitting
    const connectedNum = parseInt(connectedInput.trim());
    const unconnectedNum = parseInt(unconnectedInput.trim());

    // Validate that the parsed values are valid numbers
    if (isNaN(connectedNum) || isNaN(unconnectedNum)) {
      window.alert('Please enter valid numbers for all required fields.');
      return;
    }

    const submitData: PoliceStationConnectivityFormState = {
      no_of_ps_connected: connectedNum,
      no_of_ps_unconnected: unconnectedNum,
      remarks: formData.remarks,
    };
    
    await onSubmit(submitData);
  };

  const handleChange = (field: keyof PoliceStationConnectivityFormState, value: number | string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberChange = (field: 'no_of_ps_connected' | 'no_of_ps_unconnected', value: string) => {
    // Allow empty string or valid numbers
    if (value === '' || /^\d*$/.test(value)) {
      if (field === 'no_of_ps_connected') {
        setConnectedInput(value);
      } else {
        setUnconnectedInput(value);
      }
    }
  };

  const isDisabled = isViewMode || submitting || loading;

  const modalTitle = isViewMode ? 'View Police Station Connectivity' : isEditMode ? 'Edit Police Station Connectivity' : 'Add Police Station Connectivity';
  const modalDescription = isViewMode
    ? 'View police station connectivity details'
    : isEditMode
    ? 'Update police station connectivity information'
    : 'Add a new police station connectivity record for this Safe City project';

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
            <p className="text-muted-foreground">Loading police station connectivity data...</p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{modalDescription}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Number of PS Connected */}
            <div className="space-y-2">
              <label htmlFor="no_of_ps_connected" className="block text-sm font-medium text-foreground">
                Number of PS Connected <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="no_of_ps_connected"
                value={connectedInput}
                onChange={(e) => handleNumberChange('no_of_ps_connected', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter number of police stations connected"
                required={!isViewMode}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Number of PS Unconnected */}
            <div className="space-y-2">
              <label htmlFor="no_of_ps_unconnected" className="block text-sm font-medium text-foreground">
                Number of PS Unconnected <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="no_of_ps_unconnected"
                value={unconnectedInput}
                onChange={(e) => handleNumberChange('no_of_ps_unconnected', e.target.value)}
                disabled={isDisabled}
                placeholder="Enter number of police stations unconnected"
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
                    'Update Police Station Connectivity'
                  ) : (
                    'Add Police Station Connectivity'
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

export default PoliceStationConnectivityFormModal;

