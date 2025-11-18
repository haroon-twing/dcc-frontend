import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import OpsResponseFormModal, { OpsResponseFormState } from '../components/modals/opsresponse/OpsResponseFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface OpsResponseRecord {
  _id?: string;
  id?: string;
  is_fdbk_mech_obtain_resp_devised: boolean;
  is_fdbk_mech_suggest_measures_devised: boolean;
  no_leads_identified_ibo: number;
  no_leads_workingon_ibo: number;
  no_ibo_conducted: number;
  no_terr_apprehended: number;
  no_terr_killed: number;
  no_terr_wounded: number;
  no_terr_convicted: number;
  no_terr_apprehended_clear_by_court: number;
  no_terr_pending_cases: number;
}

const buildInitialForm = (): OpsResponseFormState => ({
  is_fdbk_mech_obtain_resp_devised: false,
  is_fdbk_mech_suggest_measures_devised: false,
  no_leads_identified_ibo: 0,
  no_leads_workingon_ibo: 0,
  no_ibo_conducted: 0,
  no_terr_apprehended: 0,
  no_terr_killed: 0,
  no_terr_wounded: 0,
  no_terr_convicted: 0,
  no_terr_apprehended_clear_by_court: 0,
  no_terr_pending_cases: 0,
});

const OpsResponseList: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<OpsResponseRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<OpsResponseRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
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

  const [formData, setFormData] = useState<OpsResponseFormState>(buildInitialForm());

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await publicApi.get('/ops-resp/get-all-ops-resp');
      const data = response.data?.data || response.data || [];
      
      const recordsData: OpsResponseRecord[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        is_fdbk_mech_obtain_resp_devised: Boolean(item.is_fdbk_mech_obtain_resp_devised),
        is_fdbk_mech_suggest_measures_devised: Boolean(item.is_fdbk_mech_suggest_measures_devised),
        no_leads_identified_ibo: item.no_leads_identified_ibo || 0,
        no_leads_workingon_ibo: item.no_leads_workingon_ibo || 0,
        no_ibo_conducted: item.no_ibo_conducted || 0,
        no_terr_apprehended: item.no_terr_apprehended || 0,
        no_terr_killed: item.no_terr_killed || 0,
        no_terr_wounded: item.no_terr_wounded || 0,
        no_terr_convicted: item.no_terr_convicted || 0,
        no_terr_apprehended_clear_by_court: item.no_terr_apprehended_clear_by_court || 0,
        no_terr_pending_cases: item.no_terr_pending_cases || 0,
      }));
      
      setRecords(recordsData);
    } catch (err: any) {
      console.error('Error fetching ops response records:', err);
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

  const handleView = (record: OpsResponseRecord) => {
    const recordId = record._id || record.id;
    if (recordId) {
      navigate(`/ops-response/details?id=${recordId}`);
    }
  };

  const handleEdit = (record: OpsResponseRecord) => {
    setFormData({
      is_fdbk_mech_obtain_resp_devised: record.is_fdbk_mech_obtain_resp_devised,
      is_fdbk_mech_suggest_measures_devised: record.is_fdbk_mech_suggest_measures_devised,
      no_leads_identified_ibo: record.no_leads_identified_ibo,
      no_leads_workingon_ibo: record.no_leads_workingon_ibo,
      no_ibo_conducted: record.no_ibo_conducted,
      no_terr_apprehended: record.no_terr_apprehended,
      no_terr_killed: record.no_terr_killed,
      no_terr_wounded: record.no_terr_wounded,
      no_terr_convicted: record.no_terr_convicted,
      no_terr_apprehended_clear_by_court: record.no_terr_apprehended_clear_by_court,
      no_terr_pending_cases: record.no_terr_pending_cases,
    });
    setEditingRecord(record);
    setShowModal(true);
  };

  const handleDelete = (record: OpsResponseRecord) => {
    const recordId = record._id || record.id;
    if (recordId) {
      setRecordToDeleteId(recordId);
      setRecordToDeleteName(`Record ID: ${recordId}`);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/ops-resp/delete-ops-resp/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
      await fetchRecords();
    } catch (error: any) {
      console.error('Error deleting ops response record:', error);
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
      const payload = {
        is_fdbk_mech_obtain_resp_devised: formData.is_fdbk_mech_obtain_resp_devised,
        is_fdbk_mech_suggest_measures_devised: formData.is_fdbk_mech_suggest_measures_devised,
        no_leads_identified_ibo: formData.no_leads_identified_ibo,
        no_leads_workingon_ibo: formData.no_leads_workingon_ibo,
        no_ibo_conducted: formData.no_ibo_conducted,
        no_terr_apprehended: formData.no_terr_apprehended,
        no_terr_killed: formData.no_terr_killed,
        no_terr_wounded: formData.no_terr_wounded,
        no_terr_convicted: formData.no_terr_convicted,
        no_terr_apprehended_clear_by_court: formData.no_terr_apprehended_clear_by_court,
        no_terr_pending_cases: formData.no_terr_pending_cases,
      };

      if (editingRecord) {
        const recordId = editingRecord._id || editingRecord.id;
        if (!recordId) {
          throw new Error('Record ID is required for update');
        }
        const updateEndpoint = `/ops-resp/update-ops-resp/${recordId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/ops-resp/add-ops-resp';
        await api.post(addEndpoint, payload);
      }

      // Refetch data after add/edit
      await fetchRecords();

      setSubmitting(false);
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
    } catch (err: any) {
      console.error('Error saving ops response record:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} record. Please try again.`
      );
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
          String(record.no_leads_identified_ibo || 0).includes(searchLower) ||
          String(record.no_ibo_conducted || 0).includes(searchLower) ||
          String(record.no_terr_apprehended || 0).includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'no_leads_identified_ibo':
            aValue = a.no_leads_identified_ibo || 0;
            bValue = b.no_leads_identified_ibo || 0;
            break;
          case 'no_ibo_conducted':
            aValue = a.no_ibo_conducted || 0;
            bValue = b.no_ibo_conducted || 0;
            break;
          case 'no_terr_apprehended':
            aValue = a.no_terr_apprehended || 0;
            bValue = b.no_terr_apprehended || 0;
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
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading records...</p>
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
                <CardTitle className="text-2xl font-bold">Ops & Response List</CardTitle>
                <p className="text-muted-foreground mt-1">Manage operations and response records</p>
              </div>
              <Button onClick={handleAdd} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Ops & Response
              </Button>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search records..."
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
                      onClick={() => handleSort('no_leads_identified_ibo')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Leads Identified (IBO) {getSortIcon('no_leads_identified_ibo')}
                    </button>
                  </TableHead>
                  <TableHead>Leads Working On (IBO)</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('no_ibo_conducted')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      IBO Conducted {getSortIcon('no_ibo_conducted')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('no_terr_apprehended')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Terrorists Apprehended {getSortIcon('no_terr_apprehended')}
                    </button>
                  </TableHead>
                  <TableHead>Terrorists Killed</TableHead>
                  <TableHead>Terrorists Wounded</TableHead>
                  <TableHead>Terrorists Convicted</TableHead>
                  <TableHead>Cleared by Court</TableHead>
                  <TableHead>Pending Cases</TableHead>
                  <TableHead>Feedback - Response Devised</TableHead>
                  <TableHead>Feedback - Measures Devised</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No records found matching your search.' : 'No records found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map((record) => (
                    <TableRow key={record._id || record.id}>
                      <TableCell>{record.no_leads_identified_ibo || 0}</TableCell>
                      <TableCell>{record.no_leads_workingon_ibo || 0}</TableCell>
                      <TableCell>{record.no_ibo_conducted || 0}</TableCell>
                      <TableCell>{record.no_terr_apprehended || 0}</TableCell>
                      <TableCell>{record.no_terr_killed || 0}</TableCell>
                      <TableCell>{record.no_terr_wounded || 0}</TableCell>
                      <TableCell>{record.no_terr_convicted || 0}</TableCell>
                      <TableCell>{record.no_terr_apprehended_clear_by_court || 0}</TableCell>
                      <TableCell>{record.no_terr_pending_cases || 0}</TableCell>
                      <TableCell>
                        {record.is_fdbk_mech_obtain_resp_devised ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.is_fdbk_mech_suggest_measures_devised ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            No
                          </span>
                        )}
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
                            <Pencil className="h-4 w-4" />
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
      </Card>

      {/* Form Modal */}
      <OpsResponseFormModal
        open={showModal}
        onOpenChange={setShowModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={editingRecord ? 'Edit Ops & Response Record' : 'Add Ops & Response Record'}
        submitLabel={editingRecord ? 'Update' : 'Save'}
        submitting={submitting}
        viewMode={false}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={recordToDeleteId}
        message={`Are you sure you want to delete "${recordToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
      />
    </div>
  );
};

export default OpsResponseList;

