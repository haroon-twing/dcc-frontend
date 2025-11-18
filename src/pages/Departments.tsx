import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/UI/Table';
import { Button } from '../components/UI/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import DepartmentFormModal from '../components/modals/departments/DepartmentFormModal';
import DeleteModal from '../components/UI/DeleteModal';

interface Department {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentToDeleteId, setDepartmentToDeleteId] = useState<string | null>(null);
  const [departmentToDeleteName, setDepartmentToDeleteName] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = () => {
    setSelectedDepartment(null);
    setFormData({
      name: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = (department: Department) => {
    setDepartmentToDeleteId(department._id);
    setDepartmentToDeleteName(department.name);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedDepartment) {
        // Create new department
        await api.post('/departments', formData);
      } else {
        // Update existing department
        await api.put(`/departments/${selectedDepartment._id}`, formData);
      }
      setShowModal(false);
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      await api.delete(`/departments/${id}`);
      setShowDeleteModal(false);
      setDepartmentToDeleteId(null);
      setDepartmentToDeleteName(null);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Failed to delete department. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Departments</h2>
        <Button onClick={handleCreate}>
          Add New Department
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
          <CardDescription>Keep track of departments, descriptions, and active status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map(department => (
                <TableRow key={department._id}>
                  <TableCell className="text-foreground">{department.name}</TableCell>
                  <TableCell className="text-muted-foreground">{department.description || '-'}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      department.isActive 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {department.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleEdit(department)}
                        variant="secondary"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDelete(department)}
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

      <DepartmentFormModal
        open={showModal}
        onOpenChange={setShowModal}
        title={selectedDepartment ? 'Edit Department' : 'Create New Department'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={departmentToDeleteId}
        message={`Are you sure you want to delete department "${departmentToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Department"
      />
    </div>
  );
};

export default Departments;
