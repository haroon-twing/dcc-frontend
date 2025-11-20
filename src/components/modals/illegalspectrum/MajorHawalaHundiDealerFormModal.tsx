import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { MajorHawalaHundiDealerFormState } from '../../illegalspectrum/MajorHawalaHundiDealers';

interface MajorHawalaHundiDealerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: MajorHawalaHundiDealerFormState;
  setFormData: React.Dispatch<React.SetStateAction<MajorHawalaHundiDealerFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const MajorHawalaHundiDealerFormModal: React.FC<MajorHawalaHundiDealerFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Major Hawala/ Hundi Dealer',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof MajorHawalaHundiDealerFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="lg">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1 max-h-[80vh] overflow-y-auto">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          disabled={viewMode}
          required
        />
        <Input
          label="Present Residence"
          value={formData.present_residence}
          onChange={(e) => handleChange('present_residence', e.target.value)}
          disabled={viewMode}
        />
        <Input
          label="Domicile"
          value={formData.domicile}
          onChange={(e) => handleChange('domicile', e.target.value)}
          disabled={viewMode}
        />
        <div>
          <label className="flex items-center space-x-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={formData.is_fam_mem_dec_terr}
              onChange={(e) => handleChange('is_fam_mem_dec_terr', e.target.checked)}
              disabled={viewMode}
              className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
            />
            <span>Family Member Declared Terrorist</span>
          </label>
        </div>
        <Input
          label="Affiliation with Target Group"
          value={formData.affiliation_tgt_grp}
          onChange={(e) => handleChange('affiliation_tgt_grp', e.target.value)}
          disabled={viewMode}
        />
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Remarks</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            rows={3}
            disabled={viewMode}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-vertical"
            placeholder="Additional notes"
          />
        </div>
        <div>
          <label className="flex items-center space-x-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              disabled={viewMode}
              className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
            />
            <span>Active</span>
          </label>
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

export default MajorHawalaHundiDealerFormModal;

