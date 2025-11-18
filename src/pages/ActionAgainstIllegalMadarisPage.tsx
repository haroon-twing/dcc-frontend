import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Button } from '../components/UI/Button';
import { Gavel, Loader2, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { publicApi } from '../lib/api';
import api from '../lib/api';
import ActionAgainstIllegalMadarisFormModal from '../components/modals/madaris/ActionAgainstIllegalMadarisFormModal';
import DeleteModal from '../components/UI/DeleteModal';

interface ActionAgainstIllegalMadaris {
  _id?: string;
  id?: string;
  name: string;
  role_of_institute: string;
  what_action_taken: string;
  date_of_action_taken: string;
  remarks: string;
  madaris_id?: string;
  madaris_name?: string;
}

interface ActionAgainstIllegalMadarisFormState {
  name: string;
  role_of_institute: string;
  what_action_taken: string;
  date_of_action_taken: string;
  remarks: string;
}

interface MadarisOption {
  _id: string;
  name: string;
}

const ActionAgainstIllegalMadarisPage: React.FC = () => {
  const [records, setRecords] = useState<ActionAgainstIllegalMadaris[]>([]);
  const [madarisList, setMadarisList] = useState<MadarisOption[]>([]);
  const [selectedMadarisId, setSelectedMadarisId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMadaris, setLoadingMadaris] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<ActionAgainstIllegalMadaris | null>(null);
  const [viewingRecord, setViewingRecord] = useState<ActionAgainstIllegalMadaris | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [loadingRecord, setLoadingRecord] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | number | undefined>(undefined);
  const [recordToDeleteName, setRecordToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  const buildInitialForm = (): ActionAgainstIllegalMadarisFormState => ({
    name: '',
    role_of_institute: '',
    what_action_taken: '',
    date_of_action_taken: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<ActionAgainstIllegalMadarisFormState>(buildInitialForm());

  const fetchMadarisList = async () => {
    try {
      setLoadingMadaris(true);
      const response = await publicApi.get('/get-all-madaris');
      const data = response.data?.data || response.data || [];
      const madaris: MadarisOption[] = data.map((item: any) => ({
        _id: item._id || item.id,
        name: item.name || 'N/A',
      }));
      setMadarisList(madaris);
    } catch (err: any) {
      console.error('Error fetching madaris list:', err);
    } finally {
      setLoadingMadaris(false);
    }
  };

  const fetchRecords = async () => {
    if (!selectedMadarisId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/madaris/get-illegal-actions/${selectedMadarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      const selectedMadaris = madarisList.find(m => m._id === selectedMadarisId);
      
      const records: ActionAgainstIllegalMadaris[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        name: item.name || 'N/A',
        role_of_institute: item.role_of_institute || 'N/A',
        what_action_taken: item.what_action_taken || 'N/A',
        date_of_action_taken: item.date_of_action_taken || '',
        remarks: item.remarks || '',
        madaris_id: selectedMadarisId,
        madaris_name: selectedMadaris?.name || 'N/A',
      }));
      
      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching action against illegal madaris records:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load action against illegal madaris records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMadarisList();
  }, []);

  useEffect(() => {
    if (madarisList.length > 0 && selectedMadarisId) {
      fetchRecords();
    }
  }, [selectedMadarisId, madarisList]);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  const handleView = async (record: ActionAgainstIllegalMadaris) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      alert('Record ID is missing. Cannot load record details.');
      return;
    }

    setLoadingRecord(true);
    setViewingRecord(record);
    setEditingRecord(null);
    setIsViewMode(true);
    
    try {
      const viewEndpoint = `/madaris/get-single-illegal-action/${recordId}`;
      const response = await publicApi.get(viewEndpoint);
      const recordData = response.data?.data || response.data;

      setFormData({
        name: recordData.name || '',
        role_of_institute: recordData.role_of_institute || '',
        what_action_taken: recordData.what_action_taken || '',
        date_of_action_taken: formatDateForInput(recordData.date_of_action_taken),
        remarks: recordData.remarks || '',
      });
      
      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching record details:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to load record details. Please try again.'
      );
      // Fallback to existing data
      setFormData({
        name: record.name || '',
        role_of_institute: record.role_of_institute || '',
        what_action_taken: record.what_action_taken || '',
        date_of_action_taken: formatDateForInput(record.date_of_action_taken),
        remarks: record.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingRecord(false);
    }
  };

  const handleEdit = (record: ActionAgainstIllegalMadaris) => {
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setFormData({
      name: record.name || '',
      role_of_institute: record.role_of_institute || '',
      what_action_taken: record.what_action_taken || '',
      date_of_action_taken: formatDateForInput(record.date_of_action_taken),
      remarks: record.remarks || '',
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    if (!selectedMadarisId) {
      alert('Please select a Madaris first.');
      return;
    }
    setEditingRecord(null);
    setViewingRecord(null);
    setIsViewMode(false);
    setFormData(buildInitialForm());
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMadarisId) {
      alert('Please select a Madaris first.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        role_of_institute: formData.role_of_institute,
        what_action_taken: formData.what_action_taken,
        date_of_action_taken: formData.date_of_action_taken,
        remarks: formData.remarks,
        madaris_id: selectedMadarisId,
      };

      if (editingRecord) {
        const recordId = editingRecord._id || editingRecord.id;
        if (!recordId) {
          throw new Error('Record ID is required for update');
        }
        const updateEndpoint = `/madaris/update-illegal-action/${recordId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/madaris/add-illegal-action';
        await api.post(addEndpoint, payload);
      }

      await fetchRecords();
      
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
    } catch (err: any) {
      console.error('Error submitting action against illegal madaris record:', err);
      alert(
        err?.response?.data?.message || 
        err?.message || 
        `Failed to ${editingRecord ? 'update' : 'add'} action against illegal madaris record. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (record: ActionAgainstIllegalMadaris) => {
    setRecordToDeleteId(record._id || record.id);
    setRecordToDeleteName(record.name);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-illegal-action/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
      
      await fetchRecords();
    } catch (error: any) {
      console.error('Error deleting action against illegal madaris record:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete action against illegal madaris record. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Action Against Illegal Madaris</h2>
          <p className="text-muted-foreground">Manage actions taken against illegal madaris across all institutions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Action Against Illegal Madaris
              </CardTitle>
              <CardDescription>Select a Madaris to view and manage actions taken against illegal madaris</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedMadarisId}
                onChange={(e) => setSelectedMadarisId(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background text-foreground"
                disabled={loadingMadaris}
              >
                <option value="">Select Madaris</option>
                {madarisList.map((madaris) => (
                  <option key={madaris._id} value={madaris._id}>
                    {madaris.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleAdd}
                size="sm"
                className="flex items-center gap-2"
                disabled={!selectedMadarisId}
              >
                <Plus className="h-4 w-4" />
                Add Action Against Illegal Madaris
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedMadarisId ? (
            <div className="text-center py-8 text-muted-foreground">
              Please select a Madaris to view actions taken against illegal madaris.
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading records...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Madaris</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role of Institute</TableHead>
                    <TableHead>What Action Taken</TableHead>
                    <TableHead>Date of Action Taken</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((record) => (
                      <TableRow key={record._id || record.id}>
                        <TableCell className="font-medium">{record.madaris_name || 'N/A'}</TableCell>
                        <TableCell className="font-medium">{record.name || 'N/A'}</TableCell>
                        <TableCell>{record.role_of_institute || 'N/A'}</TableCell>
                        <TableCell>{record.what_action_taken || 'N/A'}</TableCell>
                        <TableCell>{formatDate(record.date_of_action_taken)}</TableCell>
                        <TableCell className="max-w-xs truncate" title={record.remarks}>
                          {record.remarks || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(record)}
                              className="h-8 w-8 p-0"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(record)}
                              className="h-8 w-8 p-0"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(record)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ActionAgainstIllegalMadarisFormModal
        open={showModal}
        onOpenChange={(open) => {
          if (!open && !submitting && !loadingRecord) {
            setShowModal(false);
            setFormData(buildInitialForm());
            setEditingRecord(null);
            setViewingRecord(null);
            setIsViewMode(false);
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={isViewMode ? 'View Action Against Illegal Madaris Details' : editingRecord ? 'Edit Action Against Illegal Madaris' : 'Add Action Against Illegal Madaris'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Action Against Illegal Madaris'}
        submitting={submitting || loadingRecord}
        viewMode={isViewMode}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={recordToDeleteId}
        message={`Are you sure you want to delete "${recordToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Action Against Illegal Madaris"
      />
    </div>
  );
};

export default ActionAgainstIllegalMadarisPage;

