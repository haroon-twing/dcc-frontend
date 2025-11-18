import React, { useState, useRef, useEffect } from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';
import Input from '../../UI/Input';
import { X, Plus } from 'lucide-react';
import api from '../../../lib/api';

interface Participant {
  name: string;
  designation: string;
  organization: string;
}

interface MeetingFormState {
  date: string;
  agenda: string;
  participants: Participant[];
  location: string;
  decision_made: string;
  notes: string;
}

interface MeetingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: MeetingFormState;
  setFormData: React.Dispatch<React.SetStateAction<MeetingFormState>>;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  submitLabel?: string;
  submitting?: boolean;
  madarisId: string;
  meetingId?: string;
  viewMode?: boolean;
}

const MeetingFormModal: React.FC<MeetingFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title = 'Add Meeting',
  submitLabel = 'Save',
  submitting = false,
  madarisId,
  meetingId,
  viewMode = false,
}) => {
  const [updatingParticipant, setUpdatingParticipant] = useState<number | null>(null);
  const [addingParticipant, setAddingParticipant] = useState(false);
  const [deletingParticipant, setDeletingParticipant] = useState<number | null>(null);
  const [newParticipantIndices, setNewParticipantIndices] = useState<Set<number>>(new Set());
  
  // Debounce timers for participant updates
  const updateTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const lastParticipantStateRef = useRef<Map<number, Participant>>(new Map());

  // Reset new participants when modal opens/closes or when meetingId changes
  useEffect(() => {
    if (!open || !meetingId) {
      setNewParticipantIndices(new Set());
      // Clear all timers when modal closes
      updateTimersRef.current.forEach((timer: ReturnType<typeof setTimeout>) => clearTimeout(timer));
      updateTimersRef.current.clear();
      lastParticipantStateRef.current.clear();
    }
    
    // Cleanup timers on unmount
    return () => {
      updateTimersRef.current.forEach((timer: ReturnType<typeof setTimeout>) => clearTimeout(timer));
      updateTimersRef.current.clear();
    };
  }, [open, meetingId]);
  const handleChange = (field: keyof Omit<MeetingFormState, 'participants'>, value: string) => {
    if (viewMode) return; // Prevent changes in view mode
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleParticipantChange = async (index: number, field: keyof Participant, value: string) => {
    if (viewMode) return; // Prevent changes in view mode
    
    // Store the original participant for error recovery (capture before state update)
    const currentParticipant = formData.participants[index];
    if (!currentParticipant) return;
    
    const originalParticipant: Participant = {
      name: currentParticipant.name,
      designation: currentParticipant.designation,
      organization: currentParticipant.organization,
    };
    
    // Compute updated participant data before state update
    const updatedParticipant: Participant = {
      name: field === 'name' ? value : originalParticipant.name,
      designation: field === 'designation' ? value : originalParticipant.designation,
      organization: field === 'organization' ? value : originalParticipant.organization,
    };
    
    // Update local state immediately
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((p, i) =>
        i === index ? updatedParticipant : p
      ),
    }));

    // If meeting exists, handle API calls
    if (meetingId) {
      const isNewParticipant = newParticipantIndices.has(index);
      
      // If this is a new participant, check if all three fields have values before adding
      if (isNewParticipant) {
        const hasAllFields = 
          updatedParticipant.name.trim() !== '' &&
          updatedParticipant.designation.trim() !== '' &&
          updatedParticipant.organization.trim() !== '';
        
        // Only add to backend when all three fields are filled
        if (hasAllFields) {
          setUpdatingParticipant(index);
          try {
            const addEndpoint = `/madaris/add-participant/${meetingId}`;
            await api.post(addEndpoint, updatedParticipant);
            // Mark as no longer new
            setNewParticipantIndices((prev) => {
              const newSet = new Set(Array.from(prev));
              newSet.delete(index);
              return newSet;
            });
          } catch (error: any) {
            console.error('Error adding participant:', error);
            alert(
              error?.response?.data?.message ||
              error?.message ||
              'Failed to add participant. Please try again.'
            );
            // Revert the change on error
            setFormData((prev) => ({
              ...prev,
              participants: prev.participants.map((p, i) =>
                i === index ? originalParticipant : p
              ),
            }));
            setUpdatingParticipant(null);
            return;
          } finally {
            setUpdatingParticipant(null);
          }
        }
        // If not all fields are filled yet, just update local state (no API call)
      } else if (!isNewParticipant) {
        // Update existing participant with debouncing
        const timerKey = `${meetingId}-${index}`;
        
        // Clear existing timer for this participant
        const existingTimer = updateTimersRef.current.get(timerKey);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }
        
        // Store the current state for the debounced update
        lastParticipantStateRef.current.set(index, updatedParticipant);
        
        // Set up debounced API call (500ms delay)
        const timer = setTimeout(async () => {
          const participantToUpdate = lastParticipantStateRef.current.get(index);
          if (!participantToUpdate) return;
          
          setUpdatingParticipant(index);
          try {
            const updateEndpoint = `/madaris/update-participant/${meetingId}/${index}`;
            await api.put(updateEndpoint, participantToUpdate);
          } catch (error: any) {
            console.error('Error updating participant:', error);
            alert(
              error?.response?.data?.message ||
              error?.message ||
              'Failed to update participant. Please try again.'
            );
            // Revert the change on error
            setFormData((prev) => {
              const revertedParticipant = prev.participants[index];
              if (revertedParticipant) {
                lastParticipantStateRef.current.set(index, revertedParticipant);
              }
              return {
                ...prev,
                participants: prev.participants.map((p, i) =>
                  i === index ? originalParticipant : p
                ),
              };
            });
          } finally {
            setUpdatingParticipant(null);
            updateTimersRef.current.delete(timerKey);
          }
        }, 500); // 500ms debounce delay
        
        updateTimersRef.current.set(timerKey, timer);
      }
    }
  };

  const handleAddParticipant = () => {
    if (viewMode) return;
    
    const newParticipant = { name: '', designation: '', organization: '' };
    
    // Update local state immediately
    setFormData((prev) => {
      const newIndex = prev.participants.length;
      // Mark this participant as new (not yet saved to backend)
      setNewParticipantIndices((prevIndices) => {
        const newSet = new Set(Array.from(prevIndices));
        newSet.add(newIndex);
        return newSet;
      });
      return {
        ...prev,
        participants: [...prev.participants, newParticipant],
      };
    });

    // Don't call API immediately - wait until user enters data
    // The API will be called in handleParticipantChange when user types
  };

  const handleRemoveParticipant = async (index: number) => {
    if (viewMode) return;
    
    // Store the participant to restore on error
    const participantToRemove = formData.participants[index];
    const isNewParticipant = newParticipantIndices.has(index);
    
    // Update local state immediately
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));

    // Remove from new participants set if it was new
    if (isNewParticipant) {
      setNewParticipantIndices((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        // Adjust indices for participants after this one
        const adjustedSet = new Set<number>();
        Array.from(newSet).forEach((idx) => {
          if (idx < index) {
            adjustedSet.add(idx);
          } else if (idx > index) {
            adjustedSet.add(idx - 1);
          }
        });
        return adjustedSet;
      });
      // If it's a new participant that wasn't saved, no need to call API
      return;
    }

    // If meeting exists and participant was saved, delete via API
    if (meetingId) {
      setDeletingParticipant(index);
      try {
        const deleteEndpoint = `/madaris/delete-participant/${meetingId}/${index}`;
        await api.delete(deleteEndpoint);
      } catch (error: any) {
        console.error('Error deleting participant:', error);
        alert(
          error?.response?.data?.message ||
          error?.message ||
          'Failed to delete participant. Please try again.'
        );
        // Restore the participant on error
        setFormData((prev) => {
          const newParticipants = [...prev.participants];
          newParticipants.splice(index, 0, participantToRemove);
          return {
            ...prev,
            participants: newParticipants,
          };
        });
      } finally {
        setDeletingParticipant(null);
      }
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onOpenChange(false);
    }
  };

  // Format date for datetime-local input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
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
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Date & Time <span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              value={formatDateForInput(formData.date)}
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  const date = new Date(value);
                  handleChange('date', date.toISOString());
                } else {
                  handleChange('date', '');
                }
              }}
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., Main Hall"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Agenda */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Agenda <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.agenda}
              onChange={(e) => handleChange('agenda', e.target.value)}
              placeholder="e.g., Quarterly Review"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Participants */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                Participants
              </label>
              {!viewMode && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddParticipant}
                  disabled={addingParticipant}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  {addingParticipant ? 'Adding...' : 'Add Participant'}
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {formData.participants.length === 0 ? (
                <div className="text-sm text-muted-foreground py-2">
                  No participants added. {!viewMode && 'Click "Add Participant" to add one.'}
                </div>
              ) : (
                formData.participants.map((participant, index) => (
                  <div key={index} className="border rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Participant {index + 1}
                      </span>
                      {!viewMode && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveParticipant(index)}
                          disabled={deletingParticipant === index}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          title="Remove participant"
                        >
                          {deletingParticipant === index ? (
                            <span className="text-xs">...</span>
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                          Name
                        </label>
                        <Input
                          type="text"
                          value={participant.name}
                          onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                          placeholder="Name"
                          disabled={submitting || viewMode}
                          readOnly={viewMode}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                          Designation
                        </label>
                        <Input
                          type="text"
                          value={participant.designation}
                          onChange={(e) => handleParticipantChange(index, 'designation', e.target.value)}
                          placeholder="Designation"
                          disabled={submitting || viewMode}
                          readOnly={viewMode}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                          Organization
                        </label>
                        <Input
                          type="text"
                          value={participant.organization}
                          onChange={(e) => handleParticipantChange(index, 'organization', e.target.value)}
                          placeholder="Organization"
                          disabled={submitting || viewMode}
                          readOnly={viewMode}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Decision Made */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Decision Made <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.decision_made}
              onChange={(e) => handleChange('decision_made', e.target.value)}
              placeholder="Enter decisions made (one per line or separated by commas)..."
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-y"
              required
              disabled={submitting || viewMode}
              readOnly={viewMode}
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Enter notes..."
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

export default MeetingFormModal;

