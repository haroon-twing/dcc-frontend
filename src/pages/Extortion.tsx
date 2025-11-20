import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI/tabs';
import ExtortionFormModal, { ExtortionFormState } from '../components/modals/illegalspectrum/ExtortionFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import MajorExtortionists from '../components/illegalspectrum/MajorExtortionists';
import ExtortionIncidents from '../components/illegalspectrum/ExtortionIncidents';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface ExtortionRecord {
  id: string;
  is_db_ext_incidents_formed: boolean;
  is_classified_2types: boolean;
  is_estd_ct_helpline: boolean;
  no_calls_recvd_ct_helpline: number;
  is_public_awareness_develop: boolean;
  no_awareness_socialmedia: number;
  no_awareness_printmedia: number;
  no_awareness_electmedia: number;
  no_calls_unrelated_to_ct: number;
  no_calls_leading_action_taken_lea: number;
  no_ext_ident_shared_with_lea: number;
  no_ext_appreh_multiagency_effort: number;
  no_ext_neutr_multiagency_effort: number;
  no_ext_appreh_via_multiagency_convicted: number;
  no_ext_appreh_via_multiagency_freebycourt: number;
  no_ext_appreh_via_multiagency_case_pending: number;
}

const buildInitialForm = (): ExtortionFormState => ({
  id: undefined,
  is_db_ext_incidents_formed: false,
  is_classified_2types: false,
  is_estd_ct_helpline: false,
  no_calls_recvd_ct_helpline: 0,
  is_public_awareness_develop: false,
  no_awareness_socialmedia: 0,
  no_awareness_printmedia: 0,
  no_awareness_electmedia: 0,
  no_calls_unrelated_to_ct: 0,
  no_calls_leading_action_taken_lea: 0,
  no_ext_ident_shared_with_lea: 0,
  no_ext_appreh_multiagency_effort: 0,
  no_ext_neutr_multiagency_effort: 0,
  no_ext_appreh_via_multiagency_convicted: 0,
  no_ext_appreh_via_multiagency_freebycourt: 0,
  no_ext_appreh_via_multiagency_case_pending: 0,
});

const Extortion: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<ExtortionFormState>(buildInitialForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);
  const [extortionRecords, setExtortionRecords] = useState<ExtortionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API endpoint when available
        // const response = await publicApi.get('/get-all-extortion');
        // For now, using empty array
        setExtortionRecords([]);
      } catch (error) {
        console.error('Error fetching extortion records:', error);
        setExtortionRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitExtortion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        is_db_ext_incidents_formed: formData.is_db_ext_incidents_formed,
        is_classified_2types: formData.is_classified_2types,
        is_estd_ct_helpline: formData.is_estd_ct_helpline,
        no_calls_recvd_ct_helpline: formData.no_calls_recvd_ct_helpline,
        is_public_awareness_develop: formData.is_public_awareness_develop,
        no_awareness_socialmedia: formData.no_awareness_socialmedia,
        no_awareness_printmedia: formData.no_awareness_printmedia,
        no_awareness_electmedia: formData.no_awareness_electmedia,
        no_calls_unrelated_to_ct: formData.no_calls_unrelated_to_ct,
        no_calls_leading_action_taken_lea: formData.no_calls_leading_action_taken_lea,
        no_ext_ident_shared_with_lea: formData.no_ext_ident_shared_with_lea,
        no_ext_appreh_multiagency_effort: formData.no_ext_appreh_multiagency_effort,
        no_ext_neutr_multiagency_effort: formData.no_ext_neutr_multiagency_effort,
        no_ext_appreh_via_multiagency_convicted: formData.no_ext_appreh_via_multiagency_convicted,
        no_ext_appreh_via_multiagency_freebycourt: formData.no_ext_appreh_via_multiagency_freebycourt,
        no_ext_appreh_via_multiagency_case_pending: formData.no_ext_appreh_via_multiagency_case_pending,
      };

      let response;
      if (editingId) {
        // TODO: Replace with actual API endpoint when available
        // response = await api.put(`/update-extortion/${editingId}`, payload);
        console.log('Update extortion:', editingId, payload);
      } else {
        // TODO: Replace with actual API endpoint when available
        // response = await api.post('/add-extortion', payload);
        console.log('Add extortion:', payload);
      }

      // TODO: Refresh the list after successful submission
      // const extortionResponse = await publicApi.get('/get-all-extortion');
      // Process and set records

      // Close modal and reset form
      setShowAddModal(false);
      setFormData(buildInitialForm());
      setEditingId(null);
    } catch (error: any) {
      console.error('Error submitting extortion record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingId ? 'update' : 'add'} extortion record. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(buildInitialForm());
    setShowAddModal(true);
  };

  const openEditModal = (record: ExtortionRecord) => {
    setEditingId(record.id);
    setFormData({
      id: record.id,
      is_db_ext_incidents_formed: record.is_db_ext_incidents_formed,
      is_classified_2types: record.is_classified_2types,
      is_estd_ct_helpline: record.is_estd_ct_helpline,
      no_calls_recvd_ct_helpline: record.no_calls_recvd_ct_helpline,
      is_public_awareness_develop: record.is_public_awareness_develop,
      no_awareness_socialmedia: record.no_awareness_socialmedia,
      no_awareness_printmedia: record.no_awareness_printmedia,
      no_awareness_electmedia: record.no_awareness_electmedia,
      no_calls_unrelated_to_ct: record.no_calls_unrelated_to_ct,
      no_calls_leading_action_taken_lea: record.no_calls_leading_action_taken_lea,
      no_ext_ident_shared_with_lea: record.no_ext_ident_shared_with_lea,
      no_ext_appreh_multiagency_effort: record.no_ext_appreh_multiagency_effort,
      no_ext_neutr_multiagency_effort: record.no_ext_neutr_multiagency_effort,
      no_ext_appreh_via_multiagency_convicted: record.no_ext_appreh_via_multiagency_convicted,
      no_ext_appreh_via_multiagency_freebycourt: record.no_ext_appreh_via_multiagency_freebycourt,
      no_ext_appreh_via_multiagency_case_pending: record.no_ext_appreh_via_multiagency_case_pending,
    });
    setShowAddModal(true);
  };


  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      // TODO: Replace with actual API endpoint when available
      // await api.delete(`/delete-extortion/${id}`);
      console.log('Delete extortion:', id);

      // TODO: Refresh the list after successful deletion
      // const extortionResponse = await publicApi.get('/get-all-extortion');
      // Process and set records

      // Close modal
      setDeleteTargetId(null);
      setDeleteTargetName(null);
    } catch (error: any) {
      console.error('Error deleting extortion record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete extortion record. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const modalTitle = editingId ? 'Edit Extortion Record' : 'Add Extortion Record';
  const submitLabel = editingId ? 'Save Changes' : 'Add Extortion Record';

  // Filter and sort data
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = extortionRecords;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = extortionRecords.filter((record) => {
        return (
          record.id.toLowerCase().includes(searchLower) ||
          record.no_calls_recvd_ct_helpline.toString().includes(searchLower) ||
          record.no_awareness_socialmedia.toString().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = (a as any)[sortColumn];
        let bValue: any = (b as any)[sortColumn];

        if (typeof aValue === 'boolean') {
          aValue = aValue ? 1 : 0;
          bValue = bValue ? 1 : 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [extortionRecords, searchTerm, sortColumn, sortDirection]);

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

  const formatColumnName = (key: string): string => {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getDisplayValue = (record: ExtortionRecord, key: keyof ExtortionRecord): string => {
    const value = record[key];
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value ?? '-');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Extortion Records</h2>
          <p className="text-muted-foreground">Manage extortion cases and related statistics.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
          <Button onClick={openCreateModal} className="self-start sm:self-auto">
            Add Extortion Record
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Extortion Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('is_db_ext_incidents_formed')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    DB Ext Incidents Formed
                    {getSortIcon('is_db_ext_incidents_formed')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('is_estd_ct_helpline')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    CT Helpline Established
                    {getSortIcon('is_estd_ct_helpline')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_calls_recvd_ct_helpline')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Calls Received
                    {getSortIcon('no_calls_recvd_ct_helpline')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_ext_appreh_multiagency_effort')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Apprehended
                    {getSortIcon('no_ext_appreh_multiagency_effort')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_ext_appreh_via_multiagency_convicted')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Convicted
                    {getSortIcon('no_ext_appreh_via_multiagency_convicted')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_ext_appreh_via_multiagency_case_pending')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Pending Cases
                    {getSortIcon('no_ext_appreh_via_multiagency_case_pending')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center text-muted-foreground">
                    Loading extortion records...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No extortion records found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{getDisplayValue(record, 'is_db_ext_incidents_formed')}</TableCell>
                    <TableCell>{getDisplayValue(record, 'is_estd_ct_helpline')}</TableCell>
                    <TableCell>{getDisplayValue(record, 'no_calls_recvd_ct_helpline')}</TableCell>
                    <TableCell>{getDisplayValue(record, 'no_ext_appreh_multiagency_effort')}</TableCell>
                    <TableCell>{getDisplayValue(record, 'no_ext_appreh_via_multiagency_convicted')}</TableCell>
                    <TableCell>{getDisplayValue(record, 'no_ext_appreh_via_multiagency_case_pending')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/illegal-spectrum/extortion/details?id=${record.id}`)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditModal(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeleteTargetId(record.id);
                            setDeleteTargetName(`Extortion Record ${record.id}`);
                          }}
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
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                          variant={currentPage === page ? 'default' : 'outline'}
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
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="major-extortionists" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="major-extortionists">Major Extortionists in the Region</TabsTrigger>
          <TabsTrigger value="incidents">Incidents of Extortion</TabsTrigger>
        </TabsList>
        <TabsContent value="major-extortionists" className="mt-4">
          <MajorExtortionists extortionId={undefined} />
        </TabsContent>
        <TabsContent value="incidents" className="mt-4">
          <ExtortionIncidents extortionId={undefined} />
        </TabsContent>
      </Tabs>

      <ExtortionFormModal
        open={showAddModal}
        onOpenChange={(open) => {
          if (!open && !submitting) {
            setShowAddModal(false);
            setFormData(buildInitialForm());
            setEditingId(null);
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitExtortion}
        title={modalTitle}
        submitLabel={submitLabel}
        submitting={submitting}
        viewMode={false}
      />

      <DeleteModal
        open={!!deleteTargetId}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteTargetId(null);
            setDeleteTargetName(null);
          }
        }}
        id={deleteTargetId}
        message={`Are you sure you want to delete "${deleteTargetName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Extortion Record"
      />
    </div>
  );
};

export default Extortion;

