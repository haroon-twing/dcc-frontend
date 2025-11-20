import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI/tabs';
import HawalaHundiFormModal, { HawalaHundiFormState } from '../components/modals/illegalspectrum/HawalaHundiFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import MajorHawalaHundiDealers from '../components/illegalspectrum/MajorHawalaHundiDealers';
import IncidentsOfCrackdownHawalaHundi from '../components/illegalspectrum/IncidentsOfCrackdownHawalaHundi';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface HawalaHundiRecord {
  id: string;
  is_db_dealer_formed: boolean;
  no_dealers_convicted: number;
  no_dealers_freebycourt: number;
  no_delaers_cases_pending: number;
  is_mthly_review_prep: boolean;
  per_change_inflow: number;
  is_active: boolean;
}

const buildInitialForm = (): HawalaHundiFormState => ({
  id: undefined,
  is_db_dealer_formed: false,
  no_dealers_convicted: 0,
  no_dealers_freebycourt: 0,
  no_delaers_cases_pending: 0,
  is_mthly_review_prep: false,
  per_change_inflow: 0,
  is_active: true,
});

const HawalaHundi: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<HawalaHundiFormState>(buildInitialForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);
  const [records, setRecords] = useState<HawalaHundiRecord[]>([]);
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
        // const response = await publicApi.get('/get-all-hawala-hundi');
        // For now, using empty array
        setRecords([]);
      } catch (error) {
        console.error('Error fetching hawala hundi records:', error);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        is_db_dealer_formed: formData.is_db_dealer_formed,
        no_dealers_convicted: formData.no_dealers_convicted,
        no_dealers_freebycourt: formData.no_dealers_freebycourt,
        no_delaers_cases_pending: formData.no_delaers_cases_pending,
        is_mthly_review_prep: formData.is_mthly_review_prep,
        per_change_inflow: formData.per_change_inflow,
        is_active: formData.is_active,
      };

      let response;
      if (editingId) {
        // TODO: Replace with actual API endpoint when available
        // response = await api.put(`/update-hawala-hundi/${editingId}`, payload);
        console.log('Update hawala hundi:', editingId, payload);
      } else {
        // TODO: Replace with actual API endpoint when available
        // response = await api.post('/add-hawala-hundi', payload);
        console.log('Add hawala hundi:', payload);
      }

      // TODO: Refresh the list after successful submission
      // const recordsResponse = await publicApi.get('/get-all-hawala-hundi');
      // Process and set records

      // Close modal and reset form
      setShowAddModal(false);
      setFormData(buildInitialForm());
      setEditingId(null);
    } catch (error: any) {
      console.error('Error submitting hawala hundi record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingId ? 'update' : 'add'} hawala hundi record. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setViewingId(null);
    setFormData(buildInitialForm());
    setShowAddModal(true);
  };

  const openEditModal = (record: HawalaHundiRecord) => {
    setEditingId(record.id);
    setViewingId(null);
    setFormData({
      id: record.id,
      is_db_dealer_formed: record.is_db_dealer_formed,
      no_dealers_convicted: record.no_dealers_convicted,
      no_dealers_freebycourt: record.no_dealers_freebycourt,
      no_delaers_cases_pending: record.no_delaers_cases_pending,
      is_mthly_review_prep: record.is_mthly_review_prep,
      per_change_inflow: record.per_change_inflow,
      is_active: record.is_active,
    });
    setShowAddModal(true);
  };

  const openViewModal = (record: HawalaHundiRecord) => {
    setViewingId(record.id);
    setEditingId(null);
    setFormData({
      id: record.id,
      is_db_dealer_formed: record.is_db_dealer_formed,
      no_dealers_convicted: record.no_dealers_convicted,
      no_dealers_freebycourt: record.no_dealers_freebycourt,
      no_delaers_cases_pending: record.no_delaers_cases_pending,
      is_mthly_review_prep: record.is_mthly_review_prep,
      per_change_inflow: record.per_change_inflow,
      is_active: record.is_active,
    });
    setShowAddModal(true);
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      // TODO: Replace with actual API endpoint when available
      // await api.delete(`/delete-hawala-hundi/${id}`);
      console.log('Delete hawala hundi:', id);

      // TODO: Refresh the list after successful deletion
      // const recordsResponse = await publicApi.get('/get-all-hawala-hundi');
      // Process and set records

      // Close modal
      setDeleteTargetId(null);
      setDeleteTargetName(null);
    } catch (error: any) {
      console.error('Error deleting hawala hundi record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete hawala hundi record. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const modalTitle = viewingId
    ? 'View Hawala/ Hundi Record'
    : editingId
    ? 'Edit Hawala/ Hundi Record'
    : 'Add Hawala/ Hundi Record';
  const submitLabel = editingId ? 'Save Changes' : 'Add Hawala/ Hundi Record';

  // Filter and sort data
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = records.filter((record) => {
        return (
          record.id.toLowerCase().includes(searchLower) ||
          record.no_dealers_convicted.toString().includes(searchLower) ||
          record.per_change_inflow.toString().includes(searchLower)
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

  const getDisplayValue = (value: boolean): string => {
    return value ? 'Yes' : 'No';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Hawala/ Hundi</h2>
          <p className="text-muted-foreground">Manage hawala and hundi dealer records and statistics.</p>
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
            Add Hawala/ Hundi Record
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hawala/ Hundi Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('is_db_dealer_formed')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    DB Dealer Formed
                    {getSortIcon('is_db_dealer_formed')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_dealers_convicted')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Dealers Convicted
                    {getSortIcon('no_dealers_convicted')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_delaers_cases_pending')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Cases Pending
                    {getSortIcon('no_delaers_cases_pending')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('per_change_inflow')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    % Change Inflow
                    {getSortIcon('per_change_inflow')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('is_active')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Active
                    {getSortIcon('is_active')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    Loading hawala hundi records...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No hawala hundi records found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.is_db_dealer_formed
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {getDisplayValue(record.is_db_dealer_formed)}
                      </span>
                    </TableCell>
                    <TableCell>{record.no_dealers_convicted}</TableCell>
                    <TableCell>{record.no_delaers_cases_pending}</TableCell>
                    <TableCell>{record.per_change_inflow.toFixed(1)}%</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.is_active
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {getDisplayValue(record.is_active)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(record)}
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
                            setDeleteTargetName(`Hawala/ Hundi Record ${record.id}`);
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
      <Tabs defaultValue="major-dealers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="major-dealers">Major Hawala/ Hundi Dealers in the Region</TabsTrigger>
          <TabsTrigger value="crackdown-incidents">Incidents of Crackdown on Hawala/ Hundi Dealers</TabsTrigger>
        </TabsList>
        <TabsContent value="major-dealers" className="mt-4">
          <MajorHawalaHundiDealers hawalaHundiId={undefined} />
        </TabsContent>
        <TabsContent value="crackdown-incidents" className="mt-4">
          <IncidentsOfCrackdownHawalaHundi hawalaHundiId={undefined} />
        </TabsContent>
      </Tabs>

      <HawalaHundiFormModal
        open={showAddModal}
        onOpenChange={(open) => {
          if (!open && !submitting) {
            setShowAddModal(false);
            setFormData(buildInitialForm());
            setEditingId(null);
            setViewingId(null);
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={modalTitle}
        submitLabel={submitLabel}
        submitting={submitting}
        viewMode={!!viewingId}
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
        title="Delete Hawala/ Hundi Record"
      />
    </div>
  );
};

export default HawalaHundi;

