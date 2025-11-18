import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Button } from '../components/UI/Button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/UI/Table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import UserFormModal from '../components/modals/users/UserFormModal';
import DeleteModal from '../components/UI/DeleteModal';

interface User {
  _id: string;
  name: string;
  email: string;
  roleId?: any;
  departmentId?: any;
  sectionId?: any;
  isActive: boolean;
}

interface Role {
  _id: string;
  name: string;
}

interface Department {
  _id: string;
  name: string;
}

interface Section {
  _id: string;
  name: string;
  departmentId?: any;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
  const [userToDeleteName, setUserToDeleteName] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    departmentId: '',
    sectionId: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await api.get('/sections');
      setSections(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchDepartments();
    fetchSections();
  }, []);

  const handleCreate = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      roleId: '',
      departmentId: '',
      sectionId: ''
    });
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      roleId: user.roleId?._id || '',
      departmentId: user.departmentId?._id || '',
      sectionId: user.sectionId?._id || ''
    });
    setShowModal(true);
  };

  const handleDelete = (user: User) => {
    setUserToDeleteId(user._id);
    setUserToDeleteName(user.name);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!selectedUser) {
        // Create new user
        await api.post('/users', payload);
      } else {
        // Update existing user
        await api.put(`/users/${selectedUser._id}`, payload);
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      await api.delete(`/users/${id}`);
      setShowDeleteModal(false);
      setUserToDeleteId(null);
      setUserToDeleteName(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Users</h2>
        <Button onClick={handleCreate}>
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user access, departments, and statuses.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.roleId?.name || '-'}</TableCell>
                  <TableCell>{user.departmentId?.name || '-'}</TableCell>
                  <TableCell>{user.sectionId?.name || '-'}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleEdit(user)}
                        variant="secondary"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDelete(user)}
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

      <UserFormModal
        open={showModal}
        onOpenChange={setShowModal}
        title={selectedUser ? 'Edit User' : 'Create New User'}
        formData={formData}
        setFormData={setFormData}
        roles={roles}
        departments={departments}
        sections={sections}
        selectedUserId={selectedUser?._id}
        onSubmit={handleSubmit}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={userToDeleteId}
        message={`Are you sure you want to delete user "${userToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete User"
      />
    </div>
  );
};

export default Users;
