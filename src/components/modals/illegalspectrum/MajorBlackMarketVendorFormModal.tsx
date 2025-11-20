import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { MajorBlackMarketVendorFormState } from '../../illegalspectrum/MajorBlackMarketVendors';

interface MajorBlackMarketVendorFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: MajorBlackMarketVendorFormState;
  setFormData: React.Dispatch<React.SetStateAction<MajorBlackMarketVendorFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const MajorBlackMarketVendorFormModal: React.FC<MajorBlackMarketVendorFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Major Black-Market Vendor',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (key: keyof MajorBlackMarketVendorFormState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="xl">
      <form onSubmit={onSubmit} className="space-y-4 px-1 pb-1 max-h-[80vh] overflow-y-auto">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          disabled={viewMode}
          required
        />
        <Input
          label="Present Address"
          value={formData.present_address}
          onChange={(e) => handleChange('present_address', e.target.value)}
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
              checked={formData.is_fam_mem_terr}
              onChange={(e) => handleChange('is_fam_mem_terr', e.target.checked)}
              disabled={viewMode}
              className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
            />
            <span>Family Member Terrorist</span>
          </label>
        </div>
        <Input
          label="Affiliation with Terrorist Group"
          value={formData.affiliation_with_terr_grp}
          onChange={(e) => handleChange('affiliation_with_terr_grp', e.target.value)}
          disabled={viewMode}
        />
        <Input
          label="Main Trade"
          value={formData.main_trade}
          onChange={(e) => handleChange('main_trade', e.target.value)}
          disabled={viewMode}
        />
        <Input
          label="Major Areas Supply"
          value={formData.major_areas_supply}
          onChange={(e) => handleChange('major_areas_supply', e.target.value)}
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

export default MajorBlackMarketVendorFormModal;

