import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import SmugglingFormModal, { SmugglingFormState } from '../components/modals/illegalspectrum/SmugglingFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface SmugglingRecord {
  id: string;
  is_db_formed: boolean;
  no_smug_apprehended: number;
  no_smug_convicted: number;
  no_appr_smug_freebycourt: number;
  no_appr_smug_casepending: number;
  is_mthly_report_formed: boolean;
  remarks: string;
}

const buildInitialForm = (): SmugglingFormState => ({
  id: undefined,
  is_db_formed: false,
  no_smug_apprehended: 0,
  no_smug_convicted: 0,
  no_appr_smug_freebycourt: 0,
  no_appr_smug_casepending: 0,
  is_mthly_report_formed: false,
  remarks: '',
});

const Smuggling: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<SmugglingFormState>(buildInitialForm());
  const navigate = useNavigate();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);

  const [records, setRecords] = useState<SmugglingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Helper: format raw API items into SmugglingRecord
  const formatRecord = (item: any): SmugglingRecord => ({
    id: (item._id ?? item.id ?? '').toString(),
    is_db_formed: !!item.is_db_formed,
    no_smug_apprehended: Number(item.no_smug_apprehended ?? 0),
    no_smug_convicted: Number(item.no_smug_convicted ?? 0),
    no_appr_smug_freebycourt: Number(item.no_appr_smug_freebycourt ?? 0),
    no_appr_smug_casepending: Number(item.no_appr_smug_casepending ?? 0),
    is_mthly_report_formed: !!item.is_mthly_report_formed,
    remarks: item.remarks ?? '',
  });

  // Fetch records (used after any CRUD operation)
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await publicApi.get('/ispec-smuggling/get-all-ispec-smuggling');
      // Response might be [] or { data: [] }, handle both
      const raw = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
      const formatted = raw.map(formatRecord);
      setRecords(formatted);
    } catch (error) {
      console.error('Error fetching smuggling records:', error);
      // keep previous records but surface an alert
      window.alert('Failed to load smuggling records. Please try again.');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Submit handler for Add/Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        is_db_formed: formData.is_db_formed,
        no_smug_apprehended: formData.no_smug_apprehended,
        no_smug_convicted: formData.no_smug_convicted,
        no_appr_smug_freebycourt: formData.no_appr_smug_freebycourt,
        no_appr_smug_casepending: formData.no_appr_smug_casepending,
        is_mthly_report_formed: formData.is_mthly_report_formed,
        remarks: formData.remarks,
      };

      if (formData.id) {
        await api.put(`/ispec-smuggling/update-ispec-smuggling/${formData.id}`, payload);
        window.alert('Smuggling record updated successfully!');
      } else {
        await api.post('/ispec-smuggling/add-ispec-smuggling', payload);
        window.alert('Smuggling record added successfully!');
      }

      // Refresh list
      await fetchRecords();

      // Reset modal & form state
      setShowAddModal(false);
      setFormData(buildInitialForm());
    } catch (error: any) {
      console.error('Error submitting smuggling record:', error);
      window.alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${formData.id ? 'update' : 'add'} smuggling record. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Open create modal
  const openCreateModal = () => {
    setFormData(buildInitialForm());
    setEditingId(null);
    setShowAddModal(true);
  };

  // Open edit modal
  const openEditModal = (record: SmugglingRecord) => {
    setEditingId(record.id);
    setFormData({
      id: record.id,
      is_db_formed: record.is_db_formed,
      no_smug_apprehended: record.no_smug_apprehended,
      no_smug_convicted: record.no_smug_convicted,
      no_appr_smug_freebycourt: record.no_appr_smug_freebycourt,
      no_appr_smug_casepending: record.no_appr_smug_casepending,
      is_mthly_report_formed: record.is_mthly_report_formed,
      remarks: record.remarks ?? '',
    });
    setShowAddModal(true);
  };

  // View button click handler
  const handleView = (record: SmugglingRecord) => {
    navigate(`/illegal-spectrum/smuggling/view/${record.id}`);
  };

  // Close modal and reset form
  const closeModal = () => {
    setShowAddModal(false);
    setFormData(buildInitialForm());
    setEditingId(null);
  };

  // Delete handler (uses endpoint you provided)
  const handleDeleteSubmit = async (id: string | number | null) => {
    if (!id) return;
    setDeleting(true);

    try {
      await api.delete(`/ispec-smuggling/delete-ispec-smuggling/${id}`);
      window.alert('Smuggling record deleted successfully!');
      // refresh data
      await fetchRecords();
      // close delete modal
      setDeleteTargetId(null);
      setDeleteTargetName(null);
    } catch (error: any) {
      console.error('Error deleting smuggling record:', error);
      window.alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete smuggling record. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const modalTitle = formData.id ? 'Edit Smuggling Record' : 'Add Smuggling Record';
  const submitLabel = formData.id ? 'Save Changes' : 'Add Smuggling Record';

  // Filter and sort data (safe search access)
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;

    // Apply search filter
    if (searchTerm && searchTerm.trim().length > 0) {
      const searchLower = searchTerm.toLowerCase();
      filtered = records.filter((record) => {
        const idStr = (record.id ?? '').toString().toLowerCase();
        const remarksStr = (record.remarks ?? '').toString().toLowerCase();
        const apprehendedStr = record.no_smug_apprehended?.toString() ?? '';
        const convictedStr = record.no_smug_convicted?.toString() ?? '';
        const casePendingStr = record.no_appr_smug_casepending?.toString() ?? '';

        return (
          idStr.includes(searchLower) ||
          remarksStr.includes(searchLower) ||
          apprehendedStr.includes(searchLower) ||
          convictedStr.includes(searchLower) ||
          casePendingStr.includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = (a as any)[sortColumn];
        let bValue: any = (b as any)[sortColumn];

        // normalize undefined
        if (aValue === undefined || aValue === null) aValue = '';
        if (bValue === undefined || bValue === null) bValue = '';

        if (typeof aValue === 'boolean') {
          aValue = aValue ? 1 : 0;
          bValue = bValue ? 1 : 0;
        }

        // if numeric string compare as number
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
          if (aNum < bNum) return sortDirection === 'asc' ? -1 : 1;
          if (aNum > bNum) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        }

        // fallback to string compare
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [records, searchTerm, sortColumn, sortDirection]);

  // Ensure currentPage is valid when filtered results change
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredAndSortedRecords.length / itemsPerPage));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredAndSortedRecords, currentPage]);

  // Paginate data
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedRecords.slice(startIndex, endIndex);
  }, [filteredAndSortedRecords, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(Math.max(0, filteredAndSortedRecords.length) / itemsPerPage);

  // Sorting helpers
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

  const getDisplayValue = (value: boolean): string => (value ? 'Yes' : 'No');

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Smuggling (Food Commodities, Routine Use items, fuel etc.)</h2>
          <p className="text-muted-foreground">Manage smuggling records and statistics.</p>
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
            Add Smuggling Record
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Smuggling Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('is_db_formed')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    DB Formed
                    {getSortIcon('is_db_formed')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_smug_apprehended')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Smugglers Apprehended
                    {getSortIcon('no_smug_apprehended')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_smug_convicted')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Smugglers Convicted
                    {getSortIcon('no_smug_convicted')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_appr_smug_casepending')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Cases Pending
                    {getSortIcon('no_appr_smug_casepending')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('is_mthly_report_formed')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Monthly Report Formed
                    {getSortIcon('is_mthly_report_formed')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow key="loading">
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    Loading smuggling records...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow key="no-records">
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No smuggling records found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.is_db_formed
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {getDisplayValue(record.is_db_formed)}
                      </span>
                    </TableCell>
                    <TableCell>{record.no_smug_apprehended}</TableCell>
                    <TableCell>{record.no_smug_convicted}</TableCell>
                    <TableCell>{record.no_appr_smug_casepending}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.is_mthly_report_formed
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {getDisplayValue(record.is_mthly_report_formed)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(record)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => openEditModal(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeleteTargetId(record.id);
                            setDeleteTargetName(`Smuggling Record ${record.id}`);
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredAndSortedRecords.length)} of {filteredAndSortedRecords.length} entries
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
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
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

      <SmugglingFormModal
        open={showAddModal}
        onOpenChange={(open) => !open && closeModal()}
        onSubmit={handleSubmit}
        title={modalTitle}
        submitLabel={submitLabel}
        formData={formData}
        setFormData={setFormData}
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
        message="Are you sure you want to delete this record? This action cannot be undone."
        onSubmit={() => handleDeleteSubmit(deleteTargetId)}
        deleting={deleting}
        title="Delete Smuggling Record"
      />
    </div>
  );
};

export default Smuggling;