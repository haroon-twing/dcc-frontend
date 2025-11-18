import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Button } from '../components/UI/Button';
import { AlertTriangle, Loader2, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { publicApi } from '../lib/api';
import api from '../lib/api';
import NonCooperativeFormModal from '../components/modals/madaris/NonCooperativeFormModal';
import DeleteModal from '../components/UI/DeleteModal';

interface NonCooperative {
  _id?: string;
  id?: string;
  role_of_institute: string;
  nature_of_non_cooperation: string;
  remarks: string;
  madaris_id?: string;
  madaris_name?: string;
}

interface NonCooperativeFormState {
  role_of_institute: string;
  nature_of_non_cooperation: string;
  remarks: string;
}

interface MadarisOption {
  _id: string;
  name: string;
}

const NonCooperativePage: React.FC = () => {
  const [records, setRecords] = useState<NonCooperative[]>([]);
  const [madarisList, setMadarisList] = useState<MadarisOption[]>([]);
  const [selectedMadarisId, setSelectedMadarisId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMadaris, setLoadingMadaris] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<NonCooperative | null>(null);
  const [viewingRecord, setViewingRecord] = useState<NonCooperative | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [loadingRecord, setLoadingRecord] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | number | undefined>(undefined);
  const [recordToDeleteName, setRecordToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  const buildInitialForm = (): NonCooperativeFormState => ({
    role_of_institute: '',
    nature_of_non_cooperation: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<NonCooperativeFormState>(buildInitialForm());

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
      const endpoint = `/madaris/get-non-cooperative-records/${selectedMadarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      const selectedMadaris = madarisList.find(m => m._id === selectedMadarisId);
      
      const records: NonCooperative[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        role_of_institute: item.role_of_institute || 'N/A',
        nature_of_non_cooperation: item.nature_of_non_cooperation || 'N/A',
        remarks: item.remarks || '',
        madaris_id: selectedMadarisId,
        madaris_name: selectedMadaris?.name || 'N/A',
      }));
      
      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching non-cooperative records:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load non-cooperative records');
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

  const handleView = async (record: NonCooperative) => {
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
      const viewEndpoint = `/madaris/get-single-non-cooperative-record/${recordId}`;
      const response = await publicApi.get(viewEndpoint);
      const recordData = response.data?.data || response.data;

      setFormData({
        role_of_institute: recordData.role_of_institute || '',
        nature_of_non_cooperation: recordData.nature_of_non_cooperation || '',
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
        role_of_institute: record.role_of_institute || '',
        nature_of_non_cooperation: record.nature_of_non_cooperation || '',
        remarks: record.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingRecord(false);
    }
  };

  const handleEdit = (record: NonCooperative) => {
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setFormData({
      role_of_institute: record.role_of_institute || '',
      nature_of_non_cooperation: record.nature_of_non_cooperation || '',
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
        role_of_institute: formData.role_of_institute,
        nature_of_non_cooperation: formData.nature_of_non_cooperation,
        remarks: formData.remarks,
        madaris_id: selectedMadarisId,
      };

      if (editingRecord) {
        const recordId = editingRecord._id || editingRecord.id;
        if (!recordId) {
          throw new Error('Record ID is required for update');
        }
        const updateEndpoint = `/madaris/update-non-cooperative-record/${recordId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/madaris/add-non-cooperative-record';
        await api.post(addEndpoint, payload);
      }

      await fetchRecords();
      
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
    } catch (err: any) {
      console.error('Error submitting non-cooperative record:', err);
      alert(
        err?.response?.data?.message || 
        err?.message || 
        `Failed to ${editingRecord ? 'update' : 'add'} non-cooperative record. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (record: NonCooperative) => {
    setRecordToDeleteId(record._id || record.id);
    setRecordToDeleteName(record.nature_of_non_cooperation);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-non-cooperative-record/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
      
      await fetchRecords();
    } catch (error: any) {
      console.error('Error deleting non-cooperative record:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete non-cooperative record. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Non Cooperative Records</h2>
          <p className="text-muted-foreground">Manage non-cooperative records across all madaris</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Non Cooperative
              </CardTitle>
              <CardDescription>Select a Madaris to view and manage non-cooperative records</CardDescription>
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
                Add Non Cooperative
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedMadarisId ? (
            <div className="text-center py-8 text-muted-foreground">
              Please select a Madaris to view non-cooperative records.
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading non-cooperative records...</p>
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
                    <TableHead>Role of Institute</TableHead>
                    <TableHead>Nature of Non Cooperation</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No non-cooperative records found for this institution.
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((record) => (
                      <TableRow key={record._id || record.id}>
                        <TableCell className="font-medium">{record.madaris_name || 'N/A'}</TableCell>
                        <TableCell>{record.role_of_institute || 'N/A'}</TableCell>
                        <TableCell>{record.nature_of_non_cooperation || 'N/A'}</TableCell>
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

      <NonCooperativeFormModal
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
        title={isViewMode ? 'View Non Cooperative Details' : editingRecord ? 'Edit Non Cooperative' : 'Add Non Cooperative'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Non Cooperative'}
        submitting={submitting || loadingRecord}
        viewMode={isViewMode}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={recordToDeleteId}
        message={`Are you sure you want to delete this non-cooperative record? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Non Cooperative Record"
      />
    </div>
  );
};

export default NonCooperativePage;

