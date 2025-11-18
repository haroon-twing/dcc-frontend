import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';

interface DepartmentOption {
  _id: string;
  name: string;
}

interface SectionFormState {
  name: string;
  description: string;
  departmentId: string;
}

interface SectionFormModalProps {
  open: boolean;
  title: string;
  formData: SectionFormState;
  setFormData: React.Dispatch<React.SetStateAction<SectionFormState>>;
  departments: DepartmentOption[];
  onSubmit: (e: React.FormEvent) => void;
  onOpenChange: (open: boolean) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring';

const SectionFormModal: React.FC<SectionFormModalProps> = ({
  open,
  title,
  formData,
  setFormData,
  departments,
  onSubmit,
  onOpenChange,
}) => {
  const closeModal = () => onOpenChange(false);

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Department</label>
          <select
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            required
            className={inputClass}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className={`${inputClass} resize-vertical`}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" onClick={closeModal} variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            {title.includes('Edit') ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SectionFormModal;
