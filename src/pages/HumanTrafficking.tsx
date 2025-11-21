import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI/tabs';
import HumanTraffickingFormModal, { HumanTraffickingFormState } from '../components/modals/illegalspectrum/HumanTraffickingFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import MajorModesAndMotivationsOfHumanTraffickingByDistrict from '../components/illegalspectrum/MajorModesAndMotivationsOfHumanTraffickingByDistrict';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface HumanTraffickingRecord {
  id: string;
  is_db_formed: boolean;
  no_ops_launch_against_ht_networks: number;
  no_indv_appr_during_ops: number;
  no_indv_neut_during_ops: number;
  no_indv_appr_ht_charges_convicted: number;
  no_indv_appr_ht_charges_setfreebycourt: number;
  no_indv_appr_ht_charges_pendingcases: number;
  is_mthly_trend_anal_report_prep: boolean;
  remarks: string;
}

const buildInitialForm = (): HumanTraffickingFormState => ({
  id: undefined,
  is_db_formed: false,
  no_ops_launch_against_ht_networks: 0,
  no_indv_appr_during_ops: 0,
  no_indv_neut_during_ops: 0,
  no_indv_appr_ht_charges_convicted: 0,
  no_indv_appr_ht_charges_setfreebycourt: 0,
  no_indv_appr_ht_charges_pendingcases: 0,
  is_mthly_trend_anal_report_prep: false,
  remarks: '',
});

const HumanTrafficking: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<HumanTraffickingFormState>(buildInitialForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);
  const [records, setRecords] = useState<HumanTraffickingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching human trafficking records...');

      const response = await publicApi.get('/ispec-human-traff/get-all-ispec-human-traff');
      console.log('Human trafficking API response:', response);

      let data = response.data;
      if (Array.isArray(data)) {
        data = { data };
      }

      const recordsData = data.data || data || [];
      const mappedRecords: HumanTraffickingRecord[] = recordsData.map((item: any) => ({
        id: String(item._id || item.id || ''),
        is_db_formed: Boolean(item.is_db_formed),
        no_ops_launch_against_ht_networks: Number(item.no_ops_launch_against_ht_networks) || 0,
        no_indv_appr_during_ops: Number(item.no_indv_appr_during_ops) || 0,
        no_indv_neut_during_ops: Number(item.no_indv_neut_during_ops) || 0,
        no_indv_appr_ht_charges_convicted: Number(item.no_indv_appr_ht_charges_convicted) || 0,
        no_indv_appr_ht_charges_setfreebycourt: Number(item.no_indv_appr_ht_charges_setfreebycourt) || 0,
        no_indv_appr_ht_charges_pendingcases: Number(item.no_indv_appr_ht_charges_pendingcases) || 0,
        is_mthly_trend_anal_report_prep: Boolean(item.is_mthly_trend_anal_report_prep),
        remarks: item.remarks || '',
      }));

      setRecords(mappedRecords);
    } catch (error: any) {
      console.error('Error fetching human trafficking records:', error);
      window.alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load human trafficking records. Please try again.'
      );
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        is_db_formed: formData.is_db_formed,
        no_ops_launch_against_ht_networks: formData.no_ops_launch_against_ht_networks,
        no_indv_appr_during_ops: formData.no_indv_appr_during_ops,
        no_indv_neut_during_ops: formData.no_indv_neut_during_ops,
        no_indv_appr_ht_charges_convicted: formData.no_indv_appr_ht_charges_convicted,
        no_indv_appr_ht_charges_setfreebycourt: formData.no_indv_appr_ht_charges_setfreebycourt,
        no_indv_appr_ht_charges_pendingcases: formData.no_indv_appr_ht_charges_pendingcases,
        is_mthly_trend_anal_report_prep: formData.is_mthly_trend_anal_report_prep,
        remarks: formData.remarks,
      };

      let response;
      if (editingId) {
        console.log('Updating human trafficking record:', editingId, payload);
        response = await api.put(`/ispec-human-traff/update-ispec-human-traff/${editingId}`, payload);
        console.log('Update human trafficking response:', response);
        window.alert('Human trafficking record updated successfully!');
      } else {
        console.log('Adding human trafficking record:', payload);
        response = await api.post('/ispec-human-traff/add-ispec-human-traff', payload);
        console.log('Add human trafficking response:', response);
        window.alert('Human trafficking record added successfully!');
      }

      await fetchRecords();

      // Close modal and reset form
      setShowAddModal(false);
      setFormData(buildInitialForm());
      setEditingId(null);
    } catch (error: any) {
      console.error('Error submitting human trafficking record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingId ? 'update' : 'add'} human trafficking record. Please try again.`
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

  const openEditModal = (record: HumanTraffickingRecord) => {
    setEditingId(record.id);
    setFormData({
      id: record.id,
      is_db_formed: record.is_db_formed,
      no_ops_launch_against_ht_networks: record.no_ops_launch_against_ht_networks,
      no_indv_appr_during_ops: record.no_indv_appr_during_ops,
      no_indv_neut_during_ops: record.no_indv_neut_during_ops,
      no_indv_appr_ht_charges_convicted: record.no_indv_appr_ht_charges_convicted,
      no_indv_appr_ht_charges_setfreebycourt: record.no_indv_appr_ht_charges_setfreebycourt,
      no_indv_appr_ht_charges_pendingcases: record.no_indv_appr_ht_charges_pendingcases,
      is_mthly_trend_anal_report_prep: record.is_mthly_trend_anal_report_prep,
      remarks: record.remarks,
    });
    setShowAddModal(true);
  };

  const handleView = (record: HumanTraffickingRecord) => {
    const recordId = record.id;
    if (!recordId) {
      window.alert('Record ID is required to view details');
      return;
    }
    navigate(`/illegal-spectrum/human-trafficking/details/${recordId}`);
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      console.log('Deleting human trafficking record:', id);
      await api.delete(`/ispec-human-traff/delete-ispec-human-traff/${id}`);
      console.log('Delete human trafficking response: success');

      await fetchRecords();

      // Close modal
      setDeleteTargetId(null);
      setDeleteTargetName(null);
      window.alert('Human trafficking record deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting human trafficking record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete human trafficking record. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const modalTitle = editingId ? 'Edit Human Trafficking Record' : 'Add Human Trafficking Record';
  const submitLabel = editingId ? 'Save Changes' : 'Add Human Trafficking Record';

  // Filter and sort data
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = records.filter((record) => {
        return (
          record.id.toLowerCase().includes(searchLower) ||
          record.remarks.toLowerCase().includes(searchLower) ||
          record.no_ops_launch_against_ht_networks.toString().includes(searchLower)
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
          <h2 className="text-2xl font-bold text-foreground">Human Trafficking</h2>
          <p className="text-muted-foreground">Manage human trafficking records and operations statistics.</p>
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
            Add Human Trafficking Record
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Human Trafficking Overview</CardTitle>
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
                    onClick={() => handleSort('no_ops_launch_against_ht_networks')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Operations Launched
                    {getSortIcon('no_ops_launch_against_ht_networks')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_indv_appr_during_ops')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Individuals Apprehended
                    {getSortIcon('no_indv_appr_during_ops')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_indv_appr_ht_charges_convicted')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Convicted
                    {getSortIcon('no_indv_appr_ht_charges_convicted')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('is_mthly_trend_anal_report_prep')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Monthly Report Prepared
                    {getSortIcon('is_mthly_trend_anal_report_prep')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    Loading human trafficking records...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No human trafficking records found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.is_db_formed
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {getDisplayValue(record.is_db_formed)}
                      </span>
                    </TableCell>
                    <TableCell>{record.no_ops_launch_against_ht_networks}</TableCell>
                    <TableCell>{record.no_indv_appr_during_ops}</TableCell>
                    <TableCell>{record.no_indv_appr_ht_charges_convicted}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.is_mthly_trend_anal_report_prep
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {getDisplayValue(record.is_mthly_trend_anal_report_prep)}
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
                            setDeleteTargetName('Human Trafficking Record');
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
      <Tabs defaultValue="modes-motivations" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="modes-motivations">Major Modes and Motivations of Human Trafficking by District</TabsTrigger>
        </TabsList>
        <TabsContent value="modes-motivations" className="mt-4">
          <MajorModesAndMotivationsOfHumanTraffickingByDistrict humanTraffickingId={undefined} />
        </TabsContent>
      </Tabs>

      <HumanTraffickingFormModal
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
        onSubmit={handleSubmit}
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
        title="Delete Human Trafficking Record"
      />
    </div>
  );
};

export default HumanTrafficking;

