import React from 'react';
import Modal from '../../UI/Modal';
import { Button } from '../../UI/Button';

interface Permission {
  _id: string;
  resource: string;
  action: string;
  description?: string;
}

interface RoleFormState {
  name: string;
  description: string;
  permissions: string[];
}

interface RoleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: RoleFormState;
  setFormData: React.Dispatch<React.SetStateAction<RoleFormState>>;
  permissionFilter: string;
  setPermissionFilter: React.Dispatch<React.SetStateAction<string>>;
  filteredPermissions: string[];
  groupedPermissions: Record<string, Permission[]>;
  togglePermission: (permissionId: string) => void;
  selectAllPermissions: () => void;
  clearAllPermissions: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

const formLabelClass = 'block text-sm font-medium text-foreground mb-1';
const inputClass =
  'w-full px-3 py-2 border border-input bg-background text-foreground placeholder:text-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition';
const textareaClass =
  'w-full px-3 py-2 border border-input bg-background text-foreground placeholder:text-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-vertical transition';

const RoleFormModal: React.FC<RoleFormModalProps> = ({
  open,
  onOpenChange,
  title,
  formData,
  setFormData,
  permissionFilter,
  setPermissionFilter,
  filteredPermissions,
  groupedPermissions,
  togglePermission,
  selectAllPermissions,
  clearAllPermissions,
  onSubmit,
  isEditing,
}) => {
  const closeModal = () => onOpenChange(false);

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className={formLabelClass}>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={formLabelClass}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className={textareaClass}
          />
        </div>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <label className={formLabelClass}>
              Permissions ({formData.permissions.length}/{Object.values(groupedPermissions).flat().length})
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAllPermissions}
                className="px-3 py-2 text-xs font-semibold rounded bg-emerald-500 text-white hover:bg-emerald-600 transition"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearAllPermissions}
                className="px-3 py-2 text-xs font-semibold rounded bg-muted text-foreground hover:bg-muted/80 transition"
              >
                Clear All
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search permissions..."
            value={permissionFilter}
            onChange={(e) => setPermissionFilter(e.target.value)}
            className={`${inputClass} mb-2`}
          />

          <div className="max-h-80 overflow-y-auto border border-border rounded-lg p-3 space-y-4 bg-background/90">
            {filteredPermissions.length === 0 ? (
              <div className="text-center text-muted-foreground py-6">
                {permissionFilter ? 'No permissions found matching your search.' : 'No permissions available.'}
              </div>
            ) : (
              filteredPermissions.map((resource) => (
                <div key={resource} className="space-y-2">
                  <div className="font-semibold bg-muted/40 px-3 py-2 rounded border border-border text-foreground">
                    {resource} ({groupedPermissions[resource].length} permissions)
                  </div>
                  <div className="space-y-2 pl-2">
                    {groupedPermissions[resource].map((permission) => (
                      <label key={permission._id} className="flex items-start gap-2 text-sm text-foreground">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission._id)}
                          onChange={() => togglePermission(permission._id)}
                          className="mt-1 h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
                        />
                        <span className="leading-5">
                          <span className="font-medium">{permission.action}</span>
                          {permission.description && (
                            <span className="text-muted-foreground text-xs ml-2">- {permission.description}</span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Save Changes' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RoleFormModal;
