import React, { useState, useRef, useEffect } from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { Badge } from '../../UI/badge';
import { X, ChevronDown, Plus } from 'lucide-react';

interface Subject {
  _id?: string;
  id?: string;
  subject: string;
}

interface CurriculumFormState {
  title: string;
  description: string;
  status: string;
  remarks: string;
  selectedSubjects: string[]; // Array of subject IDs
}

interface CurriculumFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CurriculumFormState;
  setFormData: React.Dispatch<React.SetStateAction<CurriculumFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  viewMode?: boolean;
  subjects?: Subject[];
  loadingSubjects?: boolean;
}

const statusOptions = ['active', 'inactive'];

const CurriculumFormModal: React.FC<CurriculumFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Curriculum',
  submitLabel = 'Save',
  submitting = false,
  viewMode = false,
  subjects = [],
  loadingSubjects = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const maxVisibleSubjects = 4;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleChange = (field: keyof CurriculumFormState, value: string) => {
    if (viewMode) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubjectToggle = (subjectId: string) => {
    if (viewMode) return;
    const isCurrentlySelected = formData.selectedSubjects.includes(subjectId);
    setFormData((prev) => ({
      ...prev,
      selectedSubjects: isCurrentlySelected
        ? prev.selectedSubjects.filter((id) => id !== subjectId)
        : [...prev.selectedSubjects, subjectId],
    }));
    // Close dropdown after selecting (but not when deselecting from chips)
    if (!isCurrentlySelected && showDropdown) {
      setShowDropdown(false);
    }
  };

  const handleRemoveSubject = (subjectId: string) => {
    if (viewMode) return;
    setFormData((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.filter((id) => id !== subjectId),
    }));
  };

  // Get selected subject objects
  const getSelectedSubjects = () => {
    return formData.selectedSubjects
      .map((id) => subjects.find((s) => (s._id || s.id) === id))
      .filter((s): s is Subject => s !== undefined);
  };

  const selectedSubjectsList = getSelectedSubjects();
  const visibleSubjects = selectedSubjectsList.slice(0, maxVisibleSubjects);
  const remainingCount = selectedSubjectsList.length - maxVisibleSubjects;
  const availableSubjects = subjects.filter(
    (subject) => !formData.selectedSubjects.includes(subject._id || subject.id || '')
  );

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
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter curriculum title"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter curriculum description"
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-y"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Subjects Multi-Select */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Subjects
            </label>
            {loadingSubjects ? (
              <div className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm text-muted-foreground">
                Loading subjects...
              </div>
            ) : (
              <div className="space-y-2">
                {/* Selected Subjects Display (3-4 visible) */}
                {selectedSubjectsList.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border border-input bg-background rounded-md min-h-[48px]">
                    {visibleSubjects.map((subject) => {
                      const subjectId = subject._id || subject.id || '';
                      return (
                        <Badge
                          key={subjectId}
                          variant="secondary"
                          className="flex items-center gap-1 px-2 py-1"
                        >
                          <span className="text-xs">{subject.subject}</span>
                          {!viewMode && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSubject(subjectId)}
                              disabled={submitting}
                              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                              aria-label={`Remove ${subject.subject}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      );
                    })}
                    {remainingCount > 0 && (
                      <Badge variant="outline" className="px-2 py-1">
                        +{remainingCount} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Dropdown to Add More Subjects */}
                {!viewMode && (
                  <div className="relative" ref={dropdownRef}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDropdown(!showDropdown)}
                      disabled={submitting || availableSubjects.length === 0}
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        {availableSubjects.length === 0
                          ? 'All subjects selected'
                          : 'Add Subjects'}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          showDropdown ? 'rotate-180' : ''
                        }`}
                      />
                    </Button>

                    {/* Dropdown Menu */}
                    {showDropdown && availableSubjects.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto border border-input bg-background rounded-md shadow-lg">
                        <div className="p-2 space-y-1">
                          {availableSubjects.map((subject) => {
                            const subjectId = subject._id || subject.id || '';
                            return (
                              <label
                                key={subjectId}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.selectedSubjects.includes(subjectId)}
                                  onChange={() => handleSubjectToggle(subjectId)}
                                  disabled={submitting}
                                  className="rounded border-input text-primary focus:ring-primary focus:ring-offset-2"
                                />
                                <span className="text-sm text-foreground">{subject.subject}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* View Mode: Show all selected subjects */}
                {viewMode && selectedSubjectsList.length === 0 && (
                  <div className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm text-muted-foreground">
                    No subjects selected
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
              disabled={submitting || viewMode}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Additional notes or comments"
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

export default CurriculumFormModal;

