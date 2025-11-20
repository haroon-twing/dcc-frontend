import React, { useEffect } from 'react';
import Modal from '../../../components/UI/Modal';
import { Button } from '../../../components/UI/Button';
import Input from '../../../components/UI/Input';
import { PolicyAndLegislativeAmendment } from '../../../types/armsExplosives';

// Define the form data interface
export interface PolicyAndLegislativeAmendmentFormData {
  id?: string;
  name_executive_order: string;
  area_focus: string;
  location_affected: string;
  passed_by: string;
  passed_on: string;
  expires_on: string;
  remarks: string;
}

interface PolicyAndLegislativeAmendmentsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PolicyAndLegislativeAmendmentFormData) => void;
  loading?: boolean;
  initialData?: PolicyAndLegislativeAmendment | null;
}

const PolicyAndLegislativeAmendmentsFormModal: React.FC<PolicyAndLegislativeAmendmentsFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
  initialData,
}) => {
  const [formData, setFormData] = React.useState<PolicyAndLegislativeAmendmentFormData>({
    name_executive_order: '',
    area_focus: '',
    location_affected: '',
    passed_by: '',
    passed_on: '',
    expires_on: '',
    remarks: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name_executive_order: initialData.name_executive_order || '',
        area_focus: initialData.area_focus || '',
        location_affected: initialData.location_affected || '',
        passed_by: initialData.passed_by || '',
        passed_on: initialData.passed_on || '',
        expires_on: initialData.expires_on || '',
        remarks: initialData.remarks || '',
      });
    } else {
      setFormData({
        name_executive_order: '',
        area_focus: '',
        location_affected: '',
        passed_by: '',
        passed_on: '',
        expires_on: '',
        remarks: '',
      });
    }
  }, [initialData, open]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The parent component's handleSubmit will handle the form submission
    // We pass the form data through the onSubmit prop
    (onSubmit as any)(e);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Edit Policy/Legislative Amendment' : 'Add New Policy/Legislative Amendment'}
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name_executive_order" className="block text-sm font-medium text-gray-700">
            Executive Order Name
          </label>
          <Input
            id="name_executive_order"
            name="name_executive_order"
            value={formData.name_executive_order}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="area_focus" className="block text-sm font-medium text-gray-700">
              Area Focus
            </label>
            <Input
              id="area_focus"
              name="area_focus"
              value={formData.area_focus}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location_affected" className="block text-sm font-medium text-gray-700">
              Location Affected
            </label>
            <Input
              id="location_affected"
              name="location_affected"
              value={formData.location_affected}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="passed_by" className="block text-sm font-medium text-gray-700">
              Passed By
            </label>
            <Input
              id="passed_by"
              name="passed_by"
              value={formData.passed_by}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="passed_on" className="block text-sm font-medium text-gray-700">
              Passed On
            </label>
            <Input
              id="passed_on"
              name="passed_on"
              type="date"
              value={formData.passed_on}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="expires_on" className="block text-sm font-medium text-gray-700">
            Expires On
          </label>
          <Input
            id="expires_on"
            name="expires_on"
            type="date"
            value={formData.expires_on}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea
            id="remarks"
            name="remarks"
            rows={3}
            value={formData.remarks}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PolicyAndLegislativeAmendmentsFormModal;
