import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Button } from '../components/UI/Button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/UI/Table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import ProgramFormModal from '../components/modals/programs/ProgramFormModal';
import DeleteModal from '../components/UI/DeleteModal';

interface Program {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programToDeleteId, setProgramToDeleteId] = useState<string | null>(null);
  const [programToDeleteName, setProgramToDeleteName] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const fetchPrograms = async () => {
    try {
      const res = await api.get('/programs');
      setPrograms(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleCreate = () => {
    setSelectedProgram(null);
    setFormData({
      name: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleEdit = (program: Program) => {
    setSelectedProgram(program);
    setFormData({
      name: program.name,
      description: program.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = (program: Program) => {
    setProgramToDeleteId(program._id);
    setProgramToDeleteName(program.name);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedProgram) {
        // Create new program
        await api.post('/programs', formData);
      } else {
        // Update existing program
        await api.put(`/programs/${selectedProgram._id}`, formData);
      }
      setShowModal(false);
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      await api.delete(`/programs/${id}`);
      setShowDeleteModal(false);
      setProgramToDeleteId(null);
      setProgramToDeleteName(null);
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Programs</h2>
        <Button onClick={handleCreate}>
          Add New Program
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program Catalog</CardTitle>
          <CardDescription>Monitor academic programs, descriptions, and current status.</CardDescription>
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
              {programs.map(program => (
                <TableRow key={program._id}>
                  <TableCell>{program.name}</TableCell>
                  <TableCell>{program.description || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        program.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {program.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(program)}
                        variant="secondary"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(program)}
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

      <ProgramFormModal
        open={showModal}
        onOpenChange={setShowModal}
        title={selectedProgram ? 'Edit Program' : 'Create New Program'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={programToDeleteId}
        message={`Are you sure you want to delete program "${programToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Program"
      />
    </div>
  );
};

export default Programs;