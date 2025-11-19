import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Loader2 } from 'lucide-react';
import OfficeEstablishedFormModal, { OfficeEstablishedFormState } from '../components/modals/intelligencecycle/OfficeEstablishedFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface OfficeEstablished {
  _id?: string;
  id?: string;
  name: string;
  rank: string;
  appointment: string;
  contact_no: string;
  remarks?: string;
  [key: string]: any;
}

const buildInitialForm = (): OfficeEstablishedFormState => ({
  name: '',
  rank: '',
  appointment: '',
  contact_no: '',
  remarks: '',
});

const OfficesEstablishedPIFTAC: React.FC = () => {
  const [records, setRecords] = useState<OfficeEstablished[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<OfficeEstablished | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | number | undefined>(undefined);
  const [recordToDeleteName, setRecordToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [formData, setFormData] = useState<OfficeEstablishedFormState>(buildInitialForm());
  const navigate = useNavigate();
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      console.log('Fetching offices established records...');
      
      // Make API call to fetch offices established data
      const response = await publicApi.get('/intl-cycle-offc-estd-piftac/get-all-intl-cycle-offc-estd-piftac');
      console.log('API Response:', response);
      
      // Handle different response structures
      let data = response.data;
      if (Array.isArray(data)) {
        // If response is an array, use it directly
        data = { data };
      }
      
      // Extract the array of records from the response
      const recordsData = data.data || data || [];
      console.log(`Fetched ${recordsData.length} records`);
      
      // Map the API response to our interface
      const mappedData: OfficeEstablished[] = recordsData.map((item: any) => ({
        _id: item._id || item.id,
        id: item.id || item._id,
        name: item.name || '',
        rank: item.rank || '',
        appointment: item.appointment || '',
        contact_no: item.contact_no || '',
        remarks: item.remarks || ''
      }));
      
      setRecords(mappedData);
    } catch (err: any) {
      console.error('Error fetching offices established records:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load offices established records. Please try again.'
      );
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingRecord(null);
    setShowModal(true);
  };

  const handleView = (record: OfficeEstablished) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      window.alert('Record ID is required to view details');
      return;
    }
    navigate(`/intelligence-cycle/offices-established-piftac/details?id=${recordId}`);
  };

  const handleEdit = (record: OfficeEstablished) => {
    setFormData({
      name: record.name || '',
      rank: record.rank || '',
      appointment: record.appointment || '',
      contact_no: record.contact_no || '',
      remarks: record.remarks || '',
    });
    setEditingRecord(record);
    setShowModal(true);
  };

  const handleDelete = (record: OfficeEstablished) => {
    const recordId = record._id || record.id;
    if (recordId) {
      setRecordToDeleteId(recordId);
      setRecordToDeleteName(record.name || `Record ID: ${recordId}`);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      console.log('Deleting office established record with ID:', id);
      await api.delete(`/intl-cycle-offc-estd-piftac/delete-intl-cycle-offc-estd-piftac/${id}`);
      console.log('Record deleted successfully');
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
      await fetchRecords();
      window.alert('Office established record deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting record:', error);
      window.alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete record. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingRecord) {
        const recordId = editingRecord._id || editingRecord.id;
        if (!recordId) {
          window.alert('Record ID is required for update');
          return;
        }
        // Make API call to update existing office established record
        console.log('Updating office established record with ID:', recordId, 'Data:', formData);
        const response = await api.put(`/intl-cycle-offc-estd-piftac/update-intl-cycle-offc-estd-piftac/${recordId}`, formData);
        console.log('Update response:', response);
        window.alert('Office established record updated successfully!');
      } else {
        // Make API call to add new office established record
        console.log('Adding new office established record:', formData);
        const response = await api.post('/intl-cycle-offc-estd-piftac/add-intl-cycle-offc-estd-piftac', formData);
        console.log('Add response:', response);
        window.alert('Office established record added successfully!');
      }
      
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
      await fetchRecords();
    } catch (error: any) {
      console.error('Error saving office established:', error);
      window.alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to save office established record. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = records.filter((record) => {
        return Object.values(record).some((value) =>
          String(value || '').toLowerCase().includes(searchLower)
        );
      });
    }
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn] || '';
        const bValue = b[sortColumn] || '';
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [records, searchTerm, sortColumn, sortDirection]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedRecords, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedRecords.length / itemsPerPage);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4 ml-1 text-primary" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1 text-primary" />;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading offices established records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Offices Established at PIFTAC</CardTitle>
                <p className="text-muted-foreground mt-1">Manage offices established records</p>
              </div>
              <Button className="flex items-center gap-2" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add Office Established
              </Button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('rank')}
                  >
                    <div className="flex items-center">
                      Rank
                      {getSortIcon('rank')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('appointment')}
                  >
                    <div className="flex items-center">
                      Appointment
                      {getSortIcon('appointment')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('contact_no')}
                  >
                    <div className="flex items-center">
                      Contact Number
                      {getSortIcon('contact_no')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('remarks')}
                  >
                    <div className="flex items-center">
                      Remarks
                      {getSortIcon('remarks')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No records found matching your search.' : 'No records found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map((record) => (
                    <TableRow key={record._id || record.id}>
                      <TableCell>{record.name || 'N/A'}</TableCell>
                      <TableCell>{record.rank || 'N/A'}</TableCell>
                      <TableCell>{record.appointment || 'N/A'}</TableCell>
                      <TableCell>{record.contact_no || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate" title={record.remarks || ''}>
                        {record.remarks || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            title="View"
                            onClick={() => handleView(record)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            title="Edit"
                            onClick={() => handleEdit(record)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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
          
          {filteredAndSortedRecords.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedRecords.length)} of {filteredAndSortedRecords.length} entries
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="min-w-[40px]">
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-muted-foreground">...</span>;
                    }
                    return null;
                  })}
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <OfficeEstablishedFormModal
        open={showModal}
        onOpenChange={(open) => {
          if (!open && !submitting) {
            setShowModal(false);
            setFormData(buildInitialForm());
            setEditingRecord(null);
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={editingRecord ? 'Edit Office Established' : 'Add Office Established'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Office Established'}
        submitting={submitting}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={recordToDeleteId}
        message={`Are you sure you want to delete "${recordToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Office Established"
      />
    </div>
  );
};

export default OfficesEstablishedPIFTAC;

