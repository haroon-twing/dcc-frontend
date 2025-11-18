import React, { useEffect, useState } from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface TeacherFormState {
  full_name: string;
  gender: string;
  dob: string;
  cnic: string;
  contact_no: string;
  email: string;
  qualification: string;
  designation: string;
  joining_date: string;
  address: string;
  isMohtamim: boolean;
}

interface TeacherFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: TeacherFormState;
  setFormData: React.Dispatch<React.SetStateAction<TeacherFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  madarisId: string;
  viewMode?: boolean;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Teacher',
  submitLabel = 'Save',
  submitting = false,
  madarisId,
  viewMode = false,
}) => {
  const handleChange = (field: keyof TeacherFormState, value: string | boolean) => {
    if (viewMode) return; // Prevent changes in view mode
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    if (!submitting) {
      onOpenChange(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={title}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              placeholder=""
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
              disabled={submitting || viewMode}
            >
              <option value="">Select Gender</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* CNIC */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              CNIC <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.cnic}
              onChange={(e) => handleChange('cnic', e.target.value)}
              placeholder=""
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Contact No */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Contact No <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              value={formData.contact_no}
              onChange={(e) => handleChange('contact_no', e.target.value)}
              placeholder=""
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder=""
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Qualification <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.qualification}
              onChange={(e) => handleChange('qualification', e.target.value)}
              placeholder=""
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.designation}
              onChange={(e) => handleChange('designation', e.target.value)}
              placeholder=""
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Joining Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Joining Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.joining_date}
              onChange={(e) => handleChange('joining_date', e.target.value)}
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="House # , Street # "
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-y"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Is Mohtamim */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isMohtamim}
                onChange={(e) => handleChange('isMohtamim', e.target.checked)}
                className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                disabled={submitting || viewMode}
              />
              <span className="text-sm font-medium text-foreground">Is Mohtamim (Principal/Head)</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          {viewMode ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : submitLabel}
              </Button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default TeacherFormModal;

