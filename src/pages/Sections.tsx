import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/UI/Table';
import { Button } from '../components/UI/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import SectionFormModal from '../components/modals/sections/SectionFormModal';
import DeleteModal from '../components/UI/DeleteModal';

interface Section {
  _id: string;
  name: string;
  description?: string;
  departmentId?: any;
  isActive: boolean;
}

interface Department {
  _id: string;
  name: string;
}

const Sections: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sectionToDeleteId, setSectionToDeleteId] = useState<string | null>(null);
  const [sectionToDeleteName, setSectionToDeleteName] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    departmentId: ''
  });

  const fetchSections = async () => {
    try {
      const res = await api.get('/sections');
      setSections(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
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

  useEffect(() => {
    fetchSections();
    fetchDepartments();
  }, []);

  const handleCreate = () => {
    setSelectedSection(null);
    setFormData({
      name: '',
      description: '',
      departmentId: ''
    });
    setShowModal(true);
  };

  const handleEdit = (section: Section) => {
    setSelectedSection(section);
    setFormData({
      name: section.name,
      description: section.description || '',
      departmentId: section.departmentId?._id || ''
    });
    setShowModal(true);
  };

  const handleDelete = (section: Section) => {
    setSectionToDeleteId(section._id);
    setSectionToDeleteName(section.name);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedSection) {
        // Create new section
        await api.post('/sections', formData);
      } else {
        // Update existing section
        await api.put(`/sections/${selectedSection._id}`, formData);
      }
      setShowModal(false);
      fetchSections();
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      await api.delete(`/sections/${id}`);
      setShowDeleteModal(false);
      setSectionToDeleteId(null);
      setSectionToDeleteName(null);
      fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Sections</h2>
        <Button onClick={handleCreate}>
          Add New Section
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Directory</CardTitle>
          <CardDescription>Organize sections by department, description, and current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map(section => (
                <TableRow key={section._id}>
                  <TableCell>{section.name}</TableCell>
                  <TableCell>{section.departmentId?.name || '-'}</TableCell>
                  <TableCell>{section.description || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        section.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {section.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(section)}
                        variant="secondary"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(section)}
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

      <SectionFormModal
        open={showModal}
        onOpenChange={setShowModal}
        title={selectedSection ? 'Edit Section' : 'Create New Section'}
        formData={formData}
        setFormData={setFormData}
        departments={departments}
        onSubmit={handleSubmit}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={sectionToDeleteId}
        message={`Are you sure you want to delete section "${sectionToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Section"
      />
    </div>
  );
};

export default Sections;