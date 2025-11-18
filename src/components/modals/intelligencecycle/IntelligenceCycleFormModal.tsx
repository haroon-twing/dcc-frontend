import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

export interface IntelligenceCycleFormState {
  is_publication_province_intl_estimate: boolean;
  is_prep_action_plan: boolean;
  is_prep_m_e_framework: boolean;
  percent_completion_action_plan: number;
  is_connectivity_concerned_dept: boolean;
  is_prep_local_resp_mech: boolean;
  no_alerts_recvd: number;
  no_alerts_deduct_false: number;
  no_alerts_disposedof: number;
  is_prep_eval_report_local_affect: boolean;
}

interface IntelligenceCycleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: IntelligenceCycleFormState;
  setFormData: React.Dispatch<React.SetStateAction<IntelligenceCycleFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
  loading?: boolean;
}

const IntelligenceCycleFormModal: React.FC<IntelligenceCycleFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Intelligence Cycle',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
  loading = false,
}) => {
  const handleChange = (field: keyof IntelligenceCycleFormState, value: string | number | boolean) => {
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
            <p className="text-sm text-muted-foreground">Loading intelligence cycle details...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_publication_province_intl_estimate || false}
                  onChange={(e) => handleChange('is_publication_province_intl_estimate', e.target.checked)}
                  disabled={viewMode}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium">Publication Province Intl Estimate</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_prep_action_plan || false}
                  onChange={(e) => handleChange('is_prep_action_plan', e.target.checked)}
                  disabled={viewMode}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium">Preparation Action Plan</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_prep_m_e_framework || false}
                  onChange={(e) => handleChange('is_prep_m_e_framework', e.target.checked)}
                  disabled={viewMode}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium">Preparation M&E Framework</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_connectivity_concerned_dept || false}
                  onChange={(e) => handleChange('is_connectivity_concerned_dept', e.target.checked)}
                  disabled={viewMode}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium">Connectivity Concerned Dept</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_prep_local_resp_mech || false}
                  onChange={(e) => handleChange('is_prep_local_resp_mech', e.target.checked)}
                  disabled={viewMode}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium">Preparation Local Resp Mech</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_prep_eval_report_local_affect || false}
                  onChange={(e) => handleChange('is_prep_eval_report_local_affect', e.target.checked)}
                  disabled={viewMode}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium">Preparation Eval Report Local Affect</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="percent_completion_action_plan" className="block text-sm font-medium mb-1">
              Percent Completion Action Plan
            </label>
            <Input
              id="percent_completion_action_plan"
              type="number"
              value={formData.percent_completion_action_plan || ''}
              onChange={(e) => handleChange('percent_completion_action_plan', parseInt(e.target.value) || 0)}
              disabled={viewMode}
              min="0"
              max="100"
              placeholder="0-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="no_alerts_recvd" className="block text-sm font-medium mb-1">
                No. Alerts Received
              </label>
              <Input
                id="no_alerts_recvd"
                type="number"
                value={formData.no_alerts_recvd || ''}
                onChange={(e) => handleChange('no_alerts_recvd', parseInt(e.target.value) || 0)}
                disabled={viewMode}
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="no_alerts_deduct_false" className="block text-sm font-medium mb-1">
                No. Alerts Deduct False
              </label>
              <Input
                id="no_alerts_deduct_false"
                type="number"
                value={formData.no_alerts_deduct_false || ''}
                onChange={(e) => handleChange('no_alerts_deduct_false', parseInt(e.target.value) || 0)}
                disabled={viewMode}
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="no_alerts_disposedof" className="block text-sm font-medium mb-1">
                No. Alerts Disposed Of
              </label>
              <Input
                id="no_alerts_disposedof"
                type="number"
                value={formData.no_alerts_disposedof || ''}
                onChange={(e) => handleChange('no_alerts_disposedof', parseInt(e.target.value) || 0)}
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
      )}
    </Modal>
  );
};

export default IntelligenceCycleFormModal;

