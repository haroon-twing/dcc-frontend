import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';

interface Teacher {
  _id?: string;
  id?: string;
  full_name: string;
}

interface TeacherSupportFormState {
  teacher_id: string;
  education_obtain: string;
  edu_from: string;
  remarks: string;
}

interface TeacherSupportFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: TeacherSupportFormState;
  setFormData: React.Dispatch<React.SetStateAction<TeacherSupportFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  madarisId: string;
  viewMode?: boolean;
  teachers?: Teacher[];
  loadingTeachers?: boolean;
}

const TeacherSupportFormModal: React.FC<TeacherSupportFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Teacher Support',
  submitLabel = 'Save',
  submitting = false,
  madarisId,
  viewMode = false,
  teachers = [],
  loadingTeachers = false,
}) => {
  const handleChange = (field: keyof TeacherSupportFormState, value: string) => {
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

  // Debug: Log when modal opens to verify teacher selection
  React.useEffect(() => {
    if (open && formData.teacher_id) {
      const formTeacherId = String(formData.teacher_id || '').trim();
      const matchingTeacher = teachers.find(t => {
        const tId = String(t._id || t.id || '').trim();
        return tId === formTeacherId;
      });
      
      if (formTeacherId && !matchingTeacher && teachers.length > 0) {
        console.warn('Modal: Teacher ID in formData does not match any teacher in dropdown:', {
          formData_teacher_id: formTeacherId,
          available_teacher_ids: teachers.map(t => String(t._id || t.id || '').trim()),
          teachers_count: teachers.length
        });
      }
    }
  }, [open, formData.teacher_id, teachers]);

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={title}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Teacher */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Teacher <span className="text-red-500">*</span>
            </label>
            <select
              value={String(formData.teacher_id || '').trim()}
              onChange={(e) => handleChange('teacher_id', e.target.value.trim())}
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
              disabled={submitting || viewMode || loadingTeachers}
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => {
                const teacherId = String(teacher._id || teacher.id || '').trim();
                return (
                  <option key={teacherId} value={teacherId}>
                    {teacher.full_name}
                  </option>
                );
              })}
            </select>
            {loadingTeachers && (
              <p className="text-xs text-muted-foreground mt-1">Loading teachers...</p>
            )}
          </div>

          {/* Education Obtained */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Education Obtained <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.education_obtain}
              onChange={(e) => handleChange('education_obtain', e.target.value)}
              placeholder="e.g., Masters in Education"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Education From */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Education From <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.edu_from}
              onChange={(e) => handleChange('edu_from', e.target.value)}
              placeholder="e.g., University of Education"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Enter remarks..."
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-y"
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
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

export default TeacherSupportFormModal;

