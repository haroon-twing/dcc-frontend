import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI/tabs';
import ArmsExplosivesUreaFormModal, { ArmsExplosivesUreaFormState } from '../components/modals/illegalspectrum/ArmsExplosivesUreaFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import PolicyAndLegislativeAmendments from '../components/illegalspectrum/PolicyAndLegislativeAmendments';
import IncidentsOfCrackdown from '../components/illegalspectrum/IncidentsOfCrackdown';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface ArmsExplosivesUreaRecord {
  id: string;
  per_change_arms_inflow: number;
  per_change_explosive_inflow: number;
  per_change_illegal_urea_transportation: number;
  no_int_reports_shared_lea: number;
  no_letter_recvd_in_fdbk: number;
  per_recs_made_illegal_arms: number;
  is_recs_faster_than_mthly_inflow_ill_arms: boolean;
  per_recs_made_illegal_explosives: number;
  is_recs_faster_than_mthly_inflow_ill_exp: boolean;
  per_recs_made_illegal_urea: number;
  is_recs_faster_than_mthly_inflow_ill_urea: boolean;
  no_perpetrator_convicted: number;
  no_appreh_perp_set_freebycourt: number;
  no_perpetrator_case_remain_pending: number;
}

const buildInitialForm = (): ArmsExplosivesUreaFormState => ({
  id: undefined,
  per_change_arms_inflow: 0,
  per_change_explosive_inflow: 0,
  per_change_illegal_urea_transportation: 0,
  no_int_reports_shared_lea: 0,
  no_letter_recvd_in_fdbk: 0,
  per_recs_made_illegal_arms: 0,
  is_recs_faster_than_mthly_inflow_ill_arms: false,
  per_recs_made_illegal_explosives: 0,
  is_recs_faster_than_mthly_inflow_ill_exp: false,
  per_recs_made_illegal_urea: 0,
  is_recs_faster_than_mthly_inflow_ill_urea: false,
  no_perpetrator_convicted: 0,
  no_appreh_perp_set_freebycourt: 0,
  no_perpetrator_case_remain_pending: 0,
});

const ArmsExplosivesUrea: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<ArmsExplosivesUreaFormState>(buildInitialForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);
  const [records, setRecords] = useState<ArmsExplosivesUreaRecord[]>([]);
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
        // const response = await publicApi.get('/get-all-arms-explosives-urea');
        // For now, using empty array
        setRecords([]);
      } catch (error) {
        console.error('Error fetching arms explosives urea records:', error);
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
        per_change_arms_inflow: formData.per_change_arms_inflow,
        per_change_explosive_inflow: formData.per_change_explosive_inflow,
        per_change_illegal_urea_transportation: formData.per_change_illegal_urea_transportation,
        no_int_reports_shared_lea: formData.no_int_reports_shared_lea,
        no_letter_recvd_in_fdbk: formData.no_letter_recvd_in_fdbk,
        per_recs_made_illegal_arms: formData.per_recs_made_illegal_arms,
        is_recs_faster_than_mthly_inflow_ill_arms: formData.is_recs_faster_than_mthly_inflow_ill_arms,
        per_recs_made_illegal_explosives: formData.per_recs_made_illegal_explosives,
        is_recs_faster_than_mthly_inflow_ill_exp: formData.is_recs_faster_than_mthly_inflow_ill_exp,
        per_recs_made_illegal_urea: formData.per_recs_made_illegal_urea,
        is_recs_faster_than_mthly_inflow_ill_urea: formData.is_recs_faster_than_mthly_inflow_ill_urea,
        no_perpetrator_convicted: formData.no_perpetrator_convicted,
        no_appreh_perp_set_freebycourt: formData.no_appreh_perp_set_freebycourt,
        no_perpetrator_case_remain_pending: formData.no_perpetrator_case_remain_pending,
      };

      let response;
      if (editingId) {
        // TODO: Replace with actual API endpoint when available
        // response = await api.put(`/update-arms-explosives-urea/${editingId}`, payload);
        console.log('Update arms explosives urea:', editingId, payload);
      } else {
        // TODO: Replace with actual API endpoint when available
        // response = await api.post('/add-arms-explosives-urea', payload);
        console.log('Add arms explosives urea:', payload);
      }

      // TODO: Refresh the list after successful submission
      // const recordsResponse = await publicApi.get('/get-all-arms-explosives-urea');
      // Process and set records

      // Close modal and reset form
      setShowAddModal(false);
      setFormData(buildInitialForm());
      setEditingId(null);
    } catch (error: any) {
      console.error('Error submitting arms explosives urea record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingId ? 'update' : 'add'} arms explosives urea record. Please try again.`
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

  const openEditModal = (record: ArmsExplosivesUreaRecord) => {
    setEditingId(record.id);
    setViewingId(null);
    setFormData({
      id: record.id,
      per_change_arms_inflow: record.per_change_arms_inflow,
      per_change_explosive_inflow: record.per_change_explosive_inflow,
      per_change_illegal_urea_transportation: record.per_change_illegal_urea_transportation,
      no_int_reports_shared_lea: record.no_int_reports_shared_lea,
      no_letter_recvd_in_fdbk: record.no_letter_recvd_in_fdbk,
      per_recs_made_illegal_arms: record.per_recs_made_illegal_arms,
      is_recs_faster_than_mthly_inflow_ill_arms: record.is_recs_faster_than_mthly_inflow_ill_arms,
      per_recs_made_illegal_explosives: record.per_recs_made_illegal_explosives,
      is_recs_faster_than_mthly_inflow_ill_exp: record.is_recs_faster_than_mthly_inflow_ill_exp,
      per_recs_made_illegal_urea: record.per_recs_made_illegal_urea,
      is_recs_faster_than_mthly_inflow_ill_urea: record.is_recs_faster_than_mthly_inflow_ill_urea,
      no_perpetrator_convicted: record.no_perpetrator_convicted,
      no_appreh_perp_set_freebycourt: record.no_appreh_perp_set_freebycourt,
      no_perpetrator_case_remain_pending: record.no_perpetrator_case_remain_pending,
    });
    setShowAddModal(true);
  };

  const openViewModal = (record: ArmsExplosivesUreaRecord) => {
    setViewingId(record.id);
    setEditingId(null);
    setFormData({
      id: record.id,
      per_change_arms_inflow: record.per_change_arms_inflow,
      per_change_explosive_inflow: record.per_change_explosive_inflow,
      per_change_illegal_urea_transportation: record.per_change_illegal_urea_transportation,
      no_int_reports_shared_lea: record.no_int_reports_shared_lea,
      no_letter_recvd_in_fdbk: record.no_letter_recvd_in_fdbk,
      per_recs_made_illegal_arms: record.per_recs_made_illegal_arms,
      is_recs_faster_than_mthly_inflow_ill_arms: record.is_recs_faster_than_mthly_inflow_ill_arms,
      per_recs_made_illegal_explosives: record.per_recs_made_illegal_explosives,
      is_recs_faster_than_mthly_inflow_ill_exp: record.is_recs_faster_than_mthly_inflow_ill_exp,
      per_recs_made_illegal_urea: record.per_recs_made_illegal_urea,
      is_recs_faster_than_mthly_inflow_ill_urea: record.is_recs_faster_than_mthly_inflow_ill_urea,
      no_perpetrator_convicted: record.no_perpetrator_convicted,
      no_appreh_perp_set_freebycourt: record.no_appreh_perp_set_freebycourt,
      no_perpetrator_case_remain_pending: record.no_perpetrator_case_remain_pending,
    });
    setShowAddModal(true);
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      // TODO: Replace with actual API endpoint when available
      // await api.delete(`/delete-arms-explosives-urea/${id}`);
      console.log('Delete arms explosives urea:', id);

      // TODO: Refresh the list after successful deletion
      // const recordsResponse = await publicApi.get('/get-all-arms-explosives-urea');
      // Process and set records

      // Close modal
      setDeleteTargetId(null);
      setDeleteTargetName(null);
    } catch (error: any) {
      console.error('Error deleting arms explosives urea record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete arms explosives urea record. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const modalTitle = viewingId
    ? 'View Arms / Explosives and Illegal Urea transportation Record'
    : editingId
    ? 'Edit Arms / Explosives and Illegal Urea transportation Record'
    : 'Add Arms / Explosives and Illegal Urea transportation Record';
  const submitLabel = editingId ? 'Save Changes' : 'Add Arms / Explosives and Illegal Urea transportation Record';

  // Filter and sort data
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = records.filter((record) => {
        return (
          record.id.toLowerCase().includes(searchLower) ||
          record.per_change_arms_inflow.toString().includes(searchLower) ||
          record.per_change_explosive_inflow.toString().includes(searchLower)
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
          <h2 className="text-2xl font-bold text-foreground">Arms / Explosives and Illegal Urea transportation</h2>
          <p className="text-muted-foreground">Manage records for arms, explosives, and illegal urea transportation.</p>
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
            Add Arms / Explosives and Illegal Urea Record
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arms / Explosives and Illegal Urea Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('per_change_arms_inflow')}
                      className="flex items-center hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      % Change Arms Inflow
                      {getSortIcon('per_change_arms_inflow')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('per_change_explosive_inflow')}
                      className="flex items-center hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      % Change Explosive Inflow
                      {getSortIcon('per_change_explosive_inflow')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('per_change_illegal_urea_transportation')}
                      className="flex items-center hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      % Change Illegal Urea
                      {getSortIcon('per_change_illegal_urea_transportation')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('no_perpetrator_convicted')}
                      className="flex items-center hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      Perpetrators Convicted
                      {getSortIcon('no_perpetrator_convicted')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('is_recs_faster_than_mthly_inflow_ill_arms')}
                      className="flex items-center hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      Recs Faster (Arms)
                      {getSortIcon('is_recs_faster_than_mthly_inflow_ill_arms')}
                    </button>
                  </TableHead>
                  <TableHead className="text-right sticky right-0 bg-background">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                      Loading arms explosives urea records...
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                      {searchTerm ? 'No records found matching your search.' : 'No arms explosives urea records found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="whitespace-nowrap">{record.per_change_arms_inflow.toFixed(1)}%</TableCell>
                      <TableCell className="whitespace-nowrap">{record.per_change_explosive_inflow.toFixed(1)}%</TableCell>
                      <TableCell className="whitespace-nowrap">{record.per_change_illegal_urea_transportation.toFixed(1)}%</TableCell>
                      <TableCell className="whitespace-nowrap">{record.no_perpetrator_convicted}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.is_recs_faster_than_mthly_inflow_ill_arms
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                          {getDisplayValue(record.is_recs_faster_than_mthly_inflow_ill_arms)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right sticky right-0 bg-background">
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
                              setDeleteTargetName(`Arms / Explosives and Illegal Urea Record ${record.id}`);
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
      <Tabs defaultValue="policy-amendments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="policy-amendments">Policy and Legislative Amendments</TabsTrigger>
          <TabsTrigger value="crackdown-incidents">Incidents of Crackdown on Illegal Arms/Explosives Traders</TabsTrigger>
        </TabsList>
        <TabsContent value="policy-amendments" className="mt-4">
          <PolicyAndLegislativeAmendments armsExplosivesUreaId={undefined} />
        </TabsContent>
        <TabsContent value="crackdown-incidents" className="mt-4">
          <IncidentsOfCrackdown armsExplosivesUreaId={undefined} />
        </TabsContent>
      </Tabs>

      <ArmsExplosivesUreaFormModal
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
        title="Delete Arms / Explosives and Illegal Urea Record"
      />
    </div>
  );
};

export default ArmsExplosivesUrea;

