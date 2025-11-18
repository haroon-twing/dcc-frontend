import React from 'react';
import Modal from '../../UI/Modal';
import Input from '../../UI/Input';
import Select from '../../UI/Select';
import { Button } from '../../UI/Button';
import CascadingDropdowns from '../../UI/CascadingDropdowns';

interface LeadFormState {
  title: string;
  description: string;
  docs: string;
  response: string;
  suggestedResponse: string;
  priority: string;
  documents: File[];
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  cascadeSelection: {
    departmentId: string;
    sectionId: string;
    assignedUserIds: string[];
  };
}

interface LeadFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  formData: LeadFormState;
  setFormData: React.Dispatch<React.SetStateAction<LeadFormState>>;
  selectedLead: any;
  setSelectedLead: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const formLabelClass = 'block text-sm font-medium text-foreground mb-1';
const textareaClass =
  'w-full px-3 py-2 border border-input bg-background text-foreground placeholder:text-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition';
const fileInputClass =
  'w-full px-3 py-2 border border-input bg-background text-foreground placeholder:text-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring file:bg-background file:text-foreground file:font-medium file:border-0';

const LeadFormModal: React.FC<LeadFormModalProps> = ({
  open,
  mode,
  formData,
  setFormData,
  selectedLead,
  setSelectedLead,
  onSubmit,
  onClose,
}) => {
  const isCreate = mode === 'create';

  const handleRemoveDocument = (index: number) => {
    const newDocuments = formData.documents.filter((_, i) => i !== index);
    setFormData({ ...formData, documents: newDocuments });
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {isCreate ? 'Create New Lead' : 'Edit Lead'}
        </h2>
        <form onSubmit={onSubmit} className="max-h-[75vh] overflow-y-auto px-1 scroll-smooth space-y-4">
          <div>
            <label className={formLabelClass}>
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Lead title"
              required
            />
          </div>

          <div>
            <label className={formLabelClass}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Lead description"
              rows={3}
              className={textareaClass}
            />
          </div>

          {isCreate ? (
            <>
              <div>
                <label className={formLabelClass}>Suggested Response</label>
                <textarea
                  value={formData.suggestedResponse}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      suggestedResponse: e.target.value,
                    })
                  }
                  placeholder="Suggested response for this lead"
                  rows={3}
                  className={textareaClass}
                />
              </div>

              <div>
                <label className={formLabelClass}>Priority</label>
                <Select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={formLabelClass}>Status</label>
                <Select
                  value={selectedLead?.status || 'new'}
                  onChange={(e) => {
                    if (selectedLead) {
                      setSelectedLead({ ...selectedLead, status: e.target.value });
                    }
                  }}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed-won">Closed Won</option>
                  <option value="closed-lost">Closed Lost</option>
                </Select>
              </div>

              <div>
                <label className={formLabelClass}>Response Initiated</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedLead?.responseInitiated || false}
                    onChange={(e) => {
                      if (selectedLead) {
                        setSelectedLead({
                          ...selectedLead,
                          responseInitiated: e.target.checked,
                        });
                      }
                    }}
                    className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary focus:ring-offset-background"
                  />
                  <label className="ml-2 text-sm text-muted-foreground">
                    Mark as response initiated
                  </label>
                </div>
              </div>
            </>
          )}

          <div>
            <label className={formLabelClass}>Documentation/Notes</label>
            <textarea
              value={formData.docs}
              onChange={(e) =>
                setFormData({ ...formData, docs: e.target.value })
              }
              placeholder="Additional documentation or notes"
              rows={3}
              className={textareaClass}
            />
          </div>

          <div>
            <label className={formLabelClass}>
              Upload Documents (PDF, DOC, DOCX, XLS, XLSX)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData({ ...formData, documents: files });
              }}
              className={fileInputClass}
            />
            {formData.documents.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-emerald-500 dark:text-emerald-300 mb-1">
                  Selected {formData.documents.length} file(s):
                </p>
                <div className="space-y-1">
                  {formData.documents.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted/30 border border-border p-2 rounded"
                    >
                      <span className="text-sm text-foreground">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(index)}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!isCreate && selectedLead && (
            <div>
              <label className={formLabelClass}>Existing Documents</label>
              {(() => {
                const allDocs: Array<{ filename: string; originalName: string; size: number }> = [];
                if (selectedLead.documentFiles?.length) {
                  allDocs.push(...selectedLead.documentFiles);
                }
                if (selectedLead.documentFile && !allDocs.some(doc => doc.filename === selectedLead.documentFile?.filename)) {
                  allDocs.push(selectedLead.documentFile);
                }

                if (!allDocs.length) {
                  return <p className="text-sm text-muted-foreground">No existing documents</p>;
                }

                return (
                  <div className="bg-muted/30 rounded-lg p-3 border border-border space-y-2">
                    {allDocs.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-background p-2 rounded border border-border">
                        <span className="text-sm text-foreground truncate mr-2">{file.originalName}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                          <a
                            href={`/api/leads/documents/${file.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground">
                      Note: Uploading new files will keep existing ones unless replaced manually.
                    </p>
                  </div>
                );
              })()}
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">Assignment</h3>
            <CascadingDropdowns
              onSelectionChange={(selection) =>
                setFormData({
                  ...formData,
                  cascadeSelection: selection,
                })
              }
              selectedDepartmentId={formData.cascadeSelection.departmentId}
              selectedSectionId={formData.cascadeSelection.sectionId}
              selectedUserIds={formData.cascadeSelection.assignedUserIds}
              required
              showOnlyAssignedUsers={false}
            />
          </div>

          <div>
            <label className={formLabelClass}>Response (Optional)</label>
            <textarea
              value={formData.response}
              onChange={(e) =>
                setFormData({ ...formData, response: e.target.value })
              }
              placeholder="Initial response or comments"
              rows={2}
              className={textareaClass}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.title ||
                !formData.description ||
                !formData.cascadeSelection.departmentId
              }
            >
              {isCreate ? 'Create Lead' : 'Update Lead'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default LeadFormModal;
