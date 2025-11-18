import React from 'react';
import Modal from '../../UI/Modal';
import Input from '../../UI/Input';
import Select from '../../UI/Select';
import { Button } from '../../UI/Button';

interface OptionEntity {
  _id: string;
  name: string;
}

interface SectionEntity extends OptionEntity {
  departmentId?: OptionEntity;
}

interface UserFormState {
  name: string;
  email: string;
  password: string;
  roleId: string;
  departmentId: string;
  sectionId: string;
}

interface UserFormModalProps {
  open: boolean;
  title: string;
  formData: UserFormState;
  setFormData: React.Dispatch<React.SetStateAction<UserFormState>>;
  roles: OptionEntity[];
  departments: OptionEntity[];
  sections: SectionEntity[];
  selectedUserId?: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onOpenChange: (open: boolean) => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  title,
  formData,
  setFormData,
  roles,
  departments,
  sections,
  selectedUserId,
  onSubmit,
  onOpenChange,
}) => {
  const closeModal = () => onOpenChange(false);

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Name"
          type="text"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          label={`Password ${selectedUserId ? '(leave blank to keep current)' : ''}`}
          type="password"
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
          required={!selectedUserId}
        />
        <Select
          label="Role"
          value={formData.roleId}
          onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
          options={roles.map(role => ({ value: role._id, label: role.name }))}
          placeholder="Select Role"
          required
        />
        <Select
          label="Department"
          value={formData.departmentId}
          onChange={(e) => setFormData({ ...formData, departmentId: e.target.value, sectionId: '' })}
          options={departments.map(dept => ({ value: dept._id, label: dept.name }))}
          placeholder="Select Department"
          required
        />
        <Select
          label="Section"
          value={formData.sectionId}
          onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
          options={sections
            .filter(section => section.departmentId?._id === formData.departmentId)
            .map(section => ({ value: section._id, label: section.name }))}
          placeholder="Select Section (Optional)"
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit">
            {selectedUserId ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
