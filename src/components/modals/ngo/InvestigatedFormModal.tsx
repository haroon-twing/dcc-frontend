import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface InvestigatedFormState {
  investigating_agency_dept: string;
  nature_of_allegation: string;
  action_taken: string;
  remarks: string;
  investigation_date: string;
  status: string;
}

interface InvestigatedFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: InvestigatedFormState;
  setFormData: React.Dispatch<React.SetStateAction<InvestigatedFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
}

const InvestigatedFormModal: React.FC<InvestigatedFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Investigated',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
}) => {
  const handleChange = (field: keyof InvestigatedFormState, value: string) => {
    if (viewMode) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="investigating_agency_dept" className="block text-sm font-medium mb-1">
            Investigating Agency/Dept <span className="text-red-500">*</span>
          </label>
          <Input
            id="investigating_agency_dept"
            type="text"
            value={formData.investigating_agency_dept}
            onChange={(e) => handleChange('investigating_agency_dept', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter investigating agency/dept"
          />
        </div>

        <div>
          <label htmlFor="nature_of_allegation" className="block text-sm font-medium mb-1">
            Nature of Allegation <span className="text-red-500">*</span>
          </label>
          <Input
            id="nature_of_allegation"
            type="text"
            value={formData.nature_of_allegation}
            onChange={(e) => handleChange('nature_of_allegation', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter nature of allegation"
          />
        </div>

        <div>
          <label htmlFor="action_taken" className="block text-sm font-medium mb-1">
            Action Taken <span className="text-red-500">*</span>
          </label>
          <Input
            id="action_taken"
            type="text"
            value={formData.action_taken}
            onChange={(e) => handleChange('action_taken', e.target.value)}
            required
            disabled={viewMode}
            placeholder="Enter action taken"
          />
        </div>

        <div>
          <label htmlFor="investigation_date" className="block text-sm font-medium mb-1">
            Investigation Date <span className="text-red-500">*</span>
          </label>
          <Input
            id="investigation_date"
            type="date"
            value={formData.investigation_date ? formData.investigation_date.split('T')[0] : ''}
            onChange={(e) => {
              const dateValue = e.target.value ? `${e.target.value}T00:00:00` : '';
              handleChange('investigation_date', dateValue);
            }}
            required
            disabled={viewMode}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            required
            disabled={viewMode}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Referred">Referred</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div>
          <label htmlFor="remarks" className="block text-sm font-medium mb-1">
            Remarks
          </label>
          <textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            disabled={viewMode}
            placeholder="Enter remarks (optional)"
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
    </Modal>
  );
};

export default InvestigatedFormModal;

