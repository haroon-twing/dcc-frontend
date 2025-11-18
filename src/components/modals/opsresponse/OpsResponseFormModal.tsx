import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface OpsResponseFormState {
  is_fdbk_mech_obtain_resp_devised: boolean;
  is_fdbk_mech_suggest_measures_devised: boolean;
  no_leads_identified_ibo: number;
  no_leads_workingon_ibo: number;
  no_ibo_conducted: number;
  no_terr_apprehended: number;
  no_terr_killed: number;
  no_terr_wounded: number;
  no_terr_convicted: number;
  no_terr_apprehended_clear_by_court: number;
  no_terr_pending_cases: number;
}

interface OpsResponseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: OpsResponseFormState;
  setFormData: React.Dispatch<React.SetStateAction<OpsResponseFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const OpsResponseFormModal: React.FC<OpsResponseFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Ops & Response Record',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (field: keyof OpsResponseFormState, value: string | number | boolean) => {
    if (viewMode) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_fdbk_mech_obtain_resp_devised"
              checked={formData.is_fdbk_mech_obtain_resp_devised}
              onChange={(e) => handleChange('is_fdbk_mech_obtain_resp_devised', e.target.checked)}
              disabled={viewMode}
              className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
            />
            <label htmlFor="is_fdbk_mech_obtain_resp_devised" className="text-sm font-medium">
              Feedback Mechanism - Obtain Response Devised
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_fdbk_mech_suggest_measures_devised"
              checked={formData.is_fdbk_mech_suggest_measures_devised}
              onChange={(e) => handleChange('is_fdbk_mech_suggest_measures_devised', e.target.checked)}
              disabled={viewMode}
              className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
            />
            <label htmlFor="is_fdbk_mech_suggest_measures_devised" className="text-sm font-medium">
              Feedback Mechanism - Suggest Measures Devised
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="no_leads_identified_ibo" className="block text-sm font-medium mb-1">
              No. of Leads Identified (IBO)
            </label>
            <Input
              id="no_leads_identified_ibo"
              type="number"
              value={formData.no_leads_identified_ibo || ''}
              onChange={(e) => handleChange('no_leads_identified_ibo', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="no_leads_workingon_ibo" className="block text-sm font-medium mb-1">
              No. of Leads Working On (IBO)
            </label>
            <Input
              id="no_leads_workingon_ibo"
              type="number"
              value={formData.no_leads_workingon_ibo || ''}
              onChange={(e) => handleChange('no_leads_workingon_ibo', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label htmlFor="no_ibo_conducted" className="block text-sm font-medium mb-1">
            No. of IBO Conducted
          </label>
          <Input
            id="no_ibo_conducted"
            type="number"
            value={formData.no_ibo_conducted || ''}
            onChange={(e) => handleChange('no_ibo_conducted', parseInt(e.target.value) || 0)}
            disabled={viewMode}
            min="0"
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="no_terr_apprehended" className="block text-sm font-medium mb-1">
              No. of Terrorists Apprehended
            </label>
            <Input
              id="no_terr_apprehended"
              type="number"
              value={formData.no_terr_apprehended || ''}
              onChange={(e) => handleChange('no_terr_apprehended', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="no_terr_killed" className="block text-sm font-medium mb-1">
              No. of Terrorists Killed
            </label>
            <Input
              id="no_terr_killed"
              type="number"
              value={formData.no_terr_killed || ''}
              onChange={(e) => handleChange('no_terr_killed', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="no_terr_wounded" className="block text-sm font-medium mb-1">
              No. of Terrorists Wounded
            </label>
            <Input
              id="no_terr_wounded"
              type="number"
              value={formData.no_terr_wounded || ''}
              onChange={(e) => handleChange('no_terr_wounded', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="no_terr_convicted" className="block text-sm font-medium mb-1">
              No. of Terrorists Convicted
            </label>
            <Input
              id="no_terr_convicted"
              type="number"
              value={formData.no_terr_convicted || ''}
              onChange={(e) => handleChange('no_terr_convicted', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="no_terr_apprehended_clear_by_court" className="block text-sm font-medium mb-1">
              No. of Terrorists Apprehended - Cleared by Court
            </label>
            <Input
              id="no_terr_apprehended_clear_by_court"
              type="number"
              value={formData.no_terr_apprehended_clear_by_court || ''}
              onChange={(e) => handleChange('no_terr_apprehended_clear_by_court', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="no_terr_pending_cases" className="block text-sm font-medium mb-1">
              No. of Terrorists - Pending Cases
            </label>
            <Input
              id="no_terr_pending_cases"
              type="number"
              value={formData.no_terr_pending_cases || ''}
              onChange={(e) => handleChange('no_terr_pending_cases', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
              placeholder="0"
            />
          </div>
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
    </Modal>
  );
};

export type { OpsResponseFormState };
export default OpsResponseFormModal;

