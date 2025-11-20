import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface ExtortionFormState {
  id?: string;
  is_db_ext_incidents_formed: boolean;
  is_classified_2types: boolean;
  is_estd_ct_helpline: boolean;
  no_calls_recvd_ct_helpline: number;
  is_public_awareness_develop: boolean;
  no_awareness_socialmedia: number;
  no_awareness_printmedia: number;
  no_awareness_electmedia: number;
  no_calls_unrelated_to_ct: number;
  no_calls_leading_action_taken_lea: number;
  no_ext_ident_shared_with_lea: number;
  no_ext_appreh_multiagency_effort: number;
  no_ext_neutr_multiagency_effort: number;
  no_ext_appreh_via_multiagency_convicted: number;
  no_ext_appreh_via_multiagency_freebycourt: number;
  no_ext_appreh_via_multiagency_case_pending: number;
}

interface ExtortionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ExtortionFormState;
  setFormData: React.Dispatch<React.SetStateAction<ExtortionFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const ExtortionFormModal: React.FC<ExtortionFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Extortion Record',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof ExtortionFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatLabel = (key: string): string => {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="xl">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1 max-h-[80vh] overflow-y-auto">
        {/* Boolean Fields */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Status Flags</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center space-x-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={formData.is_db_ext_incidents_formed}
                onChange={(e) => handleChange('is_db_ext_incidents_formed', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span>DB Extortion Incidents Formed</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={formData.is_classified_2types}
                onChange={(e) => handleChange('is_classified_2types', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span>Classified 2 Types</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={formData.is_estd_ct_helpline}
                onChange={(e) => handleChange('is_estd_ct_helpline', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span>Established CT Helpline</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={formData.is_public_awareness_develop}
                onChange={(e) => handleChange('is_public_awareness_develop', e.target.checked)}
                disabled={viewMode}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <span>Public Awareness Developed</span>
            </label>
          </div>
        </div>

        {/* Number Fields */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="No. Calls Received CT Helpline"
              type="number"
              value={formData.no_calls_recvd_ct_helpline.toString()}
              onChange={(e) => handleChange('no_calls_recvd_ct_helpline', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Awareness Social Media"
              type="number"
              value={formData.no_awareness_socialmedia.toString()}
              onChange={(e) => handleChange('no_awareness_socialmedia', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Awareness Print Media"
              type="number"
              value={formData.no_awareness_printmedia.toString()}
              onChange={(e) => handleChange('no_awareness_printmedia', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Awareness Electronic Media"
              type="number"
              value={formData.no_awareness_electmedia.toString()}
              onChange={(e) => handleChange('no_awareness_electmedia', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Calls Unrelated to CT"
              type="number"
              value={formData.no_calls_unrelated_to_ct.toString()}
              onChange={(e) => handleChange('no_calls_unrelated_to_ct', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Calls Leading Action Taken LEA"
              type="number"
              value={formData.no_calls_leading_action_taken_lea.toString()}
              onChange={(e) => handleChange('no_calls_leading_action_taken_lea', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Extortion Identified Shared with LEA"
              type="number"
              value={formData.no_ext_ident_shared_with_lea.toString()}
              onChange={(e) => handleChange('no_ext_ident_shared_with_lea', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Extortion Apprehended Multi-Agency Effort"
              type="number"
              value={formData.no_ext_appreh_multiagency_effort.toString()}
              onChange={(e) => handleChange('no_ext_appreh_multiagency_effort', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Extortion Neutralized Multi-Agency Effort"
              type="number"
              value={formData.no_ext_neutr_multiagency_effort.toString()}
              onChange={(e) => handleChange('no_ext_neutr_multiagency_effort', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Extortion Apprehended via Multi-Agency Convicted"
              type="number"
              value={formData.no_ext_appreh_via_multiagency_convicted.toString()}
              onChange={(e) => handleChange('no_ext_appreh_via_multiagency_convicted', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Extortion Apprehended via Multi-Agency Freed by Court"
              type="number"
              value={formData.no_ext_appreh_via_multiagency_freebycourt.toString()}
              onChange={(e) => handleChange('no_ext_appreh_via_multiagency_freebycourt', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
            <Input
              label="No. Extortion Apprehended via Multi-Agency Case Pending"
              type="number"
              value={formData.no_ext_appreh_via_multiagency_case_pending.toString()}
              onChange={(e) => handleChange('no_ext_appreh_via_multiagency_case_pending', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
            />
          </div>
        </div>

        {!viewMode && (
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
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
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default ExtortionFormModal;

