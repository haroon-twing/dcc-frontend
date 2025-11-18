import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Button } from '../components/UI/Button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/UI/Table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import RoleFormModal from '../components/modals/roles/RoleFormModal';
import DeleteModal from '../components/UI/DeleteModal';

interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
  isActive: boolean;
}

interface Permission {
  _id: string;
  resource: string;
  action: string;
  description?: string;
}

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDeleteId, setRoleToDeleteId] = useState<string | null>(null);
  const [roleToDeleteName, setRoleToDeleteName] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  const [permissionFilter, setPermissionFilter] = useState('');

  const formLabelClass = "block text-sm font-medium text-foreground mb-1";
  const inputClass =
    "w-full px-3 py-2 border border-input bg-background text-foreground placeholder:text-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition";
  const textareaClass =
    "w-full px-3 py-2 border border-input bg-background text-foreground placeholder:text-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-vertical transition";
  const actionButtonClass =
    "px-3 py-2 text-xs font-medium rounded border border-border bg-secondary text-foreground hover:bg-secondary/80 transition";

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await api.get('/permissions');
      setPermissions(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleCreate = () => {
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
    setPermissionFilter('');
    setShowModal(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions?.map(p => p._id) || []
    });
    setPermissionFilter('');
    setShowModal(true);
  };

  const handleDelete = (role: Role) => {
    setRoleToDeleteId(role._id);
    setRoleToDeleteName(role.name);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedRole) {
        // Create new role
        await api.post('/roles', formData);
      } else {
        // Update existing role
        await api.put(`/roles/${selectedRole._id}`, formData);
      }
      setShowModal(false);
      fetchRoles();
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      await api.delete(`/roles/${id}`);
      setShowDeleteModal(false);
      setRoleToDeleteId(null);
      setRoleToDeleteName(null);
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Failed to delete role. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Filter permissions based on search
  const filteredPermissions = Object.keys(groupedPermissions).filter(resource =>
    resource.toLowerCase().includes(permissionFilter.toLowerCase()) ||
    groupedPermissions[resource].some(p => 
      p.action.toLowerCase().includes(permissionFilter.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(permissionFilter.toLowerCase()))
    )
  );

  const selectAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: permissions.map(p => p._id)
    }));
  };

  const clearAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: []
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Roles</h2>
        <Button onClick={handleCreate}>
          Add New Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Directory</CardTitle>
          <CardDescription>Overview of role definitions, permissions, and status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map(role => (
                <TableRow key={role._id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description || '-'}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold">
                        {role.permissions?.length || 0} permissions
                      </div>
                      {role.permissions && role.permissions.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {Object.keys(
                            role.permissions.reduce((acc, p) => {
                              acc[p.resource] = (acc[p.resource] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)
                          ).slice(0, 3).join(', ')}
                          {Object.keys(
                            role.permissions.reduce((acc, p) => {
                              acc[p.resource] = (acc[p.resource] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)
                          ).length > 3 && '...'}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        role.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {role.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(role)}
                        variant="secondary"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(role)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RoleFormModal
        open={showModal}
        onOpenChange={setShowModal}
        title={selectedRole ? 'Edit Role' : 'Create New Role'}
        formData={formData}
        setFormData={setFormData}
        permissionFilter={permissionFilter}
        setPermissionFilter={setPermissionFilter}
        filteredPermissions={filteredPermissions}
        groupedPermissions={groupedPermissions}
        togglePermission={togglePermission}
        selectAllPermissions={selectAllPermissions}
        clearAllPermissions={clearAllPermissions}
        onSubmit={handleSubmit}
        isEditing={!!selectedRole}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={roleToDeleteId}
        message={`Are you sure you want to delete role "${roleToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Role"
      />
    </div>
  );
};

export default Roles;
