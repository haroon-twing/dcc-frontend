import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Building2, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import PoliceStationConnectivityFormModal from '../modals/safecity/PoliceStationConnectivityFormModal';
import DeleteModal from '../UI/DeleteModal';

interface PoliceStationConnectivity {
  _id?: string;
  id?: string;
  no_of_ps_connected: number;
  no_of_ps_unconnected: number;
  remarks?: string;
  sc_id: string;
}

interface PoliceStationConnectivityFormState {
  no_of_ps_connected: number;
  no_of_ps_unconnected: number;
  remarks: string;
}

interface PoliceStationConnectivityProps {
  safeCityId: string;
}

const PoliceStationConnectivity: React.FC<PoliceStationConnectivityProps> = ({ safeCityId }) => {
  const [records, setRecords] = useState<PoliceStationConnectivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<PoliceStationConnectivity | null>(null);
  const [viewingRecord, setViewingRecord] = useState<PoliceStationConnectivity | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [loadingRecord, setLoadingRecord] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState<string | number | undefined>(undefined);
  const [recordToDeleteName, setRecordToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const buildInitialForm = (): PoliceStationConnectivityFormState => ({
    no_of_ps_connected: 0,
    no_of_ps_unconnected: 0,
    remarks: '',
  });

  const [formData, setFormData] = useState<PoliceStationConnectivityFormState>(buildInitialForm());

  const fetchRecords = async () => {
    if (!safeCityId) {
      setLoading(false);
      setRecords([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/safecity/get-safecitypolicestationconnectivities/${safeCityId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      console.log('Fetched police station connectivity data:', data);
      
      const recordsData: PoliceStationConnectivity[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        no_of_ps_connected: item.no_of_ps_connected ?? 0,
        no_of_ps_unconnected: item.no_of_ps_unconnected ?? 0,
        remarks: item.remarks || '',
        sc_id: item.sc_id || safeCityId,
      }));
      
      setRecords(recordsData);
    } catch (err: any) {
      console.error('Error fetching police station connectivity:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load police station connectivity. Please try again.'
      );
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [safeCityId]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingRecord(null);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleEdit = async (record: PoliceStationConnectivity) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      window.alert('Record ID is missing. Cannot load record details.');
      return;
    }

    setLoadingRecord(true);
    setViewingRecord(null);
    setEditingRecord(record);
    setIsViewMode(false);
    
    try {
      // TODO: Replace with actual API endpoint when available
      // const editEndpoint = `/safecity/get-single-police-station-connectivity/${recordId}`;
      // const response = await publicApi.get(editEndpoint);
      // const recordData = response.data?.data || response.data;
      
      // For now, use the record data directly
      const recordData = record;
      
      setFormData({
        no_of_ps_connected: recordData.no_of_ps_connected ?? 0,
        no_of_ps_unconnected: recordData.no_of_ps_unconnected ?? 0,
        remarks: recordData.remarks || '',
      });
      
      setShowModal(true);
    } catch (err: any) {
      console.error('Error loading record for edit:', err);
      window.alert('Failed to load record data. Please try again.');
    } finally {
      setLoadingRecord(false);
    }
  };

  const handleView = async (record: PoliceStationConnectivity) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      window.alert('Record ID is missing. Cannot load record details.');
      return;
    }

    setLoadingRecord(true);
    setEditingRecord(null);
    setViewingRecord(record);
    setIsViewMode(true);
    
    try {
      const viewEndpoint = `/safecity/get-single-safecitypolicestationconnectivity/${recordId}`;
      const response = await publicApi.get(viewEndpoint);
      const recordData = response.data?.data || response.data;
      
      console.log('Fetched police station connectivity for view:', recordData);
      
      if (recordData) {
        setFormData({
          no_of_ps_connected: recordData.no_of_ps_connected ?? 0,
          no_of_ps_unconnected: recordData.no_of_ps_unconnected ?? 0,
          remarks: recordData.remarks || '',
        });
      } else {
        // Fallback to table data if API doesn't return data
        setFormData({
          no_of_ps_connected: record.no_of_ps_connected ?? 0,
          no_of_ps_unconnected: record.no_of_ps_unconnected ?? 0,
          remarks: record.remarks || '',
        });
      }
      
      setShowModal(true);
    } catch (err: any) {
      console.error('Error loading record for view:', err);
      window.alert(err?.response?.data?.message || err?.message || 'Failed to load record data. Please try again.');
      // Fallback to table data on error
      setFormData({
        no_of_ps_connected: record.no_of_ps_connected ?? 0,
        no_of_ps_unconnected: record.no_of_ps_unconnected ?? 0,
        remarks: record.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingRecord(false);
    }
  };

  const handleDelete = (record: PoliceStationConnectivity) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      window.alert('Record ID is missing. Cannot delete record.');
      return;
    }
    
    setRecordToDeleteId(recordId);
    setRecordToDeleteName(`Police Station Connectivity (Connected: ${record.no_of_ps_connected}, Unconnected: ${record.no_of_ps_unconnected})`);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (id: string | number) => {
    if (!id) return;

    try {
      setDeleting(true);
      const deleteEndpoint = `/safecity/delete-safecitypolicestationconnectivity/${id}`;
      await api.delete(deleteEndpoint);
      
      // Remove the record from local state immediately
      setRecords((prev) => prev.filter((item) => (item._id || item.id) !== id));
      
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
      
      // Refresh the list to ensure we have the latest data from the server
      await fetchRecords();
    } catch (err: any) {
      console.error('Error deleting record:', err);
      window.alert(err?.response?.data?.message || err?.message || 'Failed to delete record. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (data: PoliceStationConnectivityFormState) => {
    try {
      setSubmitting(true);
      
      const payload = {
        no_of_ps_connected: data.no_of_ps_connected,
        no_of_ps_unconnected: data.no_of_ps_unconnected,
        sc_id: safeCityId,
        remarks: data.remarks || '',
      };

      if (editingRecord) {
        const recordId = editingRecord._id || editingRecord.id;
        if (!recordId) {
          window.alert('Record ID is missing. Cannot update record.');
          return;
        }
        
        const updateEndpoint = `/safecity/update-safecitypolicestationconnectivity/${recordId}`;
        const updateResponse = await api.put(updateEndpoint, payload);
        const updatedData = updateResponse.data?.data || updateResponse.data;
        
        // Update local state with the updated record
        if (updatedData) {
          setRecords((prev) =>
            prev.map((item) =>
              (item._id || item.id) === recordId
                ? {
                    _id: updatedData._id || updatedData.id || recordId,
                    id: updatedData._id || updatedData.id || recordId,
                    no_of_ps_connected: updatedData.no_of_ps_connected ?? 0,
                    no_of_ps_unconnected: updatedData.no_of_ps_unconnected ?? 0,
                    remarks: updatedData.remarks || '',
                    sc_id: updatedData.sc_id || safeCityId,
                  }
                : item
            )
          );
        }
      } else {
        const addEndpoint = `/safecity/add-safecitypolicestationconnectivity`;
        const addResponse = await api.post(addEndpoint, payload);
        
        console.log('Add response:', addResponse.data);
        
        // Handle different response structures
        let newRecordData = null;
        if (addResponse.data?.data) {
          newRecordData = addResponse.data.data;
        } else if (addResponse.data && typeof addResponse.data === 'object' && !addResponse.data.success) {
          newRecordData = addResponse.data;
        }
        
        console.log('Extracted newRecordData:', newRecordData);
        
        // If we got the data from response, use it; otherwise construct from payload
        if (newRecordData) {
          const newRecord: PoliceStationConnectivity = {
            _id: newRecordData._id || newRecordData.id || `temp-${Date.now()}`,
            id: newRecordData._id || newRecordData.id || `temp-${Date.now()}`,
            no_of_ps_connected: newRecordData.no_of_ps_connected ?? payload.no_of_ps_connected ?? 0,
            no_of_ps_unconnected: newRecordData.no_of_ps_unconnected ?? payload.no_of_ps_unconnected ?? 0,
            remarks: newRecordData.remarks || payload.remarks || '',
            sc_id: newRecordData.sc_id || payload.sc_id || safeCityId,
          };
          console.log('Adding new record to state:', newRecord);
          setRecords((prev) => {
            const updated = [...prev, newRecord];
            console.log('Updated records state:', updated);
            return updated;
          });
        } else {
          // Fallback: create entry from payload if response doesn't have data
          console.log('No data in response, creating from payload');
          const newRecord: PoliceStationConnectivity = {
            _id: `temp-${Date.now()}`,
            id: `temp-${Date.now()}`,
            no_of_ps_connected: payload.no_of_ps_connected ?? 0,
            no_of_ps_unconnected: payload.no_of_ps_unconnected ?? 0,
            remarks: payload.remarks || '',
            sc_id: payload.sc_id || safeCityId,
          };
          console.log('Adding new record from payload:', newRecord);
          setRecords((prev) => {
            const updated = [...prev, newRecord];
            console.log('Updated records state:', updated);
            return updated;
          });
        }
      }
      
      setShowModal(false);
      setEditingRecord(null);
      setViewingRecord(null);
      setIsViewMode(false);
      setFormData(buildInitialForm());
      
      // Refresh the list to ensure we have the latest data from the server
      await fetchRecords();
    } catch (err: any) {
      console.error('Error submitting record:', err);
      window.alert(err?.response?.data?.message || err?.message || 'Failed to save record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = records.filter((record) => {
        return (
          String(record.no_of_ps_connected || 0).includes(searchLower) ||
          String(record.no_of_ps_unconnected || 0).includes(searchLower) ||
          (record.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'no_of_ps_connected':
            aValue = a.no_of_ps_connected || 0;
            bValue = b.no_of_ps_connected || 0;
            break;
          case 'no_of_ps_unconnected':
            aValue = a.no_of_ps_unconnected || 0;
            bValue = b.no_of_ps_unconnected || 0;
            break;
          case 'remarks':
            aValue = (a.remarks || '').toLowerCase();
            bValue = (b.remarks || '').toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [records, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedRecords.slice(startIndex, endIndex);
  }, [filteredAndSortedRecords, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedRecords.length / itemsPerPage);

  // Handle sort click
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

  // Get sort icon for column
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4 ml-1 text-primary" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1 text-primary" />;
  };

  // Reset search and filters
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Police Station Connectivity
          </CardTitle>
          <CardDescription>Police station connectivity information for this Safe City project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading police station connectivity...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Police Station Connectivity
          </CardTitle>
          <CardDescription>Police station connectivity information for this Safe City project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600 dark:text-red-400">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Police Station Connectivity
              </CardTitle>
              <CardDescription>Police station connectivity information for this Safe City project</CardDescription>
            </div>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Police Station Connectivity
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search police station connectivity..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
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
                <TableHead>
                  <button
                    onClick={() => handleSort('no_of_ps_connected')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Number of PS Connected {getSortIcon('no_of_ps_connected')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_of_ps_unconnected')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Number of PS Unconnected {getSortIcon('no_of_ps_unconnected')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('remarks')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Remarks {getSortIcon('remarks')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No police station connectivity found matching your search.' : 'No police station connectivity found for this Safe City project.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell className="font-medium">{record.no_of_ps_connected || 0}</TableCell>
                    <TableCell>{record.no_of_ps_unconnected || 0}</TableCell>
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
        
        {/* Pagination */}
        {filteredAndSortedRecords.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedRecords.length)} of {filteredAndSortedRecords.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-muted-foreground">...</span>;
                  }
                  return null;
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Form Modal */}
      <PoliceStationConnectivityFormModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setEditingRecord(null);
            setViewingRecord(null);
            setIsViewMode(false);
            setFormData(buildInitialForm());
          }
        }}
        onSubmit={handleSubmit}
        initialData={isViewMode ? formData : editingRecord ? formData : null}
        isEditMode={!!editingRecord && !isViewMode}
        isViewMode={isViewMode}
        loading={loadingRecord}
        submitting={submitting}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onSubmit={handleDeleteConfirm}
        id={recordToDeleteId}
        message={`Are you sure you want to delete this police station connectivity record: ${recordToDeleteName}? This action cannot be undone.`}
        deleting={deleting}
        title="Delete Police Station Connectivity"
      />
    </Card>
  );
};

export default PoliceStationConnectivity;
