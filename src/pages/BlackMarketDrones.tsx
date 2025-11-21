import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Edit, Trash2, Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI/tabs';
import BlackMarketDronesFormModal, { BlackMarketDronesFormState } from '../components/modals/illegalspectrum/BlackMarketDronesFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import MajorBlackMarketVendors from '../components/illegalspectrum/MajorBlackMarketVendors';
import ActionAgainstIllegalVendors from '../components/illegalspectrum/ActionAgainstIllegalVendors';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface BlackMarketDronesRecord {
  id: string;
  _id?: string; // Add optional _id field for MongoDB compatibility
  is_identification_of_agencies: boolean;
  is_db_vendor_formed: boolean;
}

const buildInitialForm = (): BlackMarketDronesFormState => ({
  id: undefined,
  is_identification_of_agencies: false,
  is_db_vendor_formed: false,
});

const BlackMarketDrones: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<BlackMarketDronesFormState>(buildInitialForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);
  const [records, setRecords] = useState<BlackMarketDronesRecord[]>([]);
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
        const response = await publicApi.get('/ispec-blackmarket-drone-nvd/get-all-ispec-blackmarket-drone-nvd');
        const data = response.data?.data || response.data || [];
        
        const formattedRecords: BlackMarketDronesRecord[] = data.map((item: any) => ({
          id: item._id || item.id,
          is_identification_of_agencies: Boolean(item.is_identification_of_agencies),
          is_db_vendor_formed: Boolean(item.is_db_vendor_formed),
        }));
        
        setRecords(formattedRecords);
      } catch (error) {
        console.error('Error fetching black market drones records:', error);
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
        is_identification_of_agencies: formData.is_identification_of_agencies,
        is_db_vendor_formed: formData.is_db_vendor_formed,
      };

      if (editingId) {
        await api.put(`/ispec-blackmarket-drone-nvd/update-ispec-blackmarket-drone-nvd/${editingId}`, payload);
      } else {
        await api.post('/ispec-blackmarket-drone-nvd/add-ispec-blackmarket-drone-nvd', payload);
      }

      // Refresh the list after successful submission
      const response = await publicApi.get('/ispec-blackmarket-drone-nvd/get-all-ispec-blackmarket-drone-nvd');
      const data = response.data?.data || response.data || [];
      
      const formattedRecords: BlackMarketDronesRecord[] = data.map((item: any) => ({
        id: item._id || item.id,
        is_identification_of_agencies: Boolean(item.is_identification_of_agencies),
        is_db_vendor_formed: Boolean(item.is_db_vendor_formed),
      }));
      
      setRecords(formattedRecords);

      // Close modal and reset form
      setShowAddModal(false);
      setFormData(buildInitialForm());
      setEditingId(null);
    } catch (error: any) {
      console.error('Error submitting black market drones record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingId ? 'update' : 'add'} black market drones record. Please try again.`
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

  const openEditModal = (record: BlackMarketDronesRecord) => {
    setEditingId(record.id);
    setFormData({
      id: record.id,
      is_identification_of_agencies: record.is_identification_of_agencies,
      is_db_vendor_formed: record.is_db_vendor_formed,
    });
    setShowAddModal(true);
  };

  const handleView = (record: BlackMarketDronesRecord) => {
    const recordId = record._id || record.id;
    if (recordId) {
      navigate(`/illegal-spectrum/black-market-drones/details?id=${recordId}`);
    } else {
      // Fallback to modal if no ID is available
      setViewingId(record.id);
      setEditingId(null);
      setFormData({
        id: record.id,
        is_identification_of_agencies: record.is_identification_of_agencies,
        is_db_vendor_formed: record.is_db_vendor_formed,
      });
      setShowAddModal(true);
    }
  };

  const openViewModal = (record: BlackMarketDronesRecord) => {
    navigate(`/illegal-spectrum/black-market-drones/details?id=${record.id}`);
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      await api.delete(`/ispec-blackmarket-drone-nvd/delete-ispec-blackmarket-drone-nvd/${id}`);

      // Refresh the list after successful deletion
      const response = await publicApi.get('/ispec-blackmarket-drone-nvd/get-all-ispec-blackmarket-drone-nvd');
      const data = response.data?.data || response.data || [];
      
      const formattedRecords: BlackMarketDronesRecord[] = data.map((item: any) => ({
        id: item._id || item.id,
        is_identification_of_agencies: Boolean(item.is_identification_of_agencies),
        is_db_vendor_formed: Boolean(item.is_db_vendor_formed),
      }));
      
      setRecords(formattedRecords);
      
      setDeleteTargetId(null);
      setDeleteTargetName(null);
    } catch (error: any) {
      console.error('Error deleting black market drones record:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete black market drones record. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const modalTitle = viewingId
    ? 'View Black Market Drones Record'
    : editingId
    ? 'Edit Black Market Drones Record'
    : 'Add Black Market Drones Record';
  const submitLabel = editingId ? 'Save Changes' : 'Add Black Market Drones Record';

  // Filter and sort data
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = records.filter((record) => {
        return (
          record.id.toLowerCase().includes(searchLower) ||
          (record.is_identification_of_agencies ? 'yes' : 'no').includes(searchLower) ||
          (record.is_db_vendor_formed ? 'yes' : 'no').includes(searchLower)
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
          <h2 className="text-2xl font-bold text-foreground">Black Market of Drones, NVDs etc</h2>
          <p className="text-muted-foreground">Manage black market records for drones, NVDs and related items.</p>
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
            Add Black Market Drones Record
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Black Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('is_identification_of_agencies')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Identification of Agencies
                    {getSortIcon('is_identification_of_agencies')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('is_db_vendor_formed')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    DB Vendor Formed
                    {getSortIcon('is_db_vendor_formed')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                    Loading black market drones records...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No black market drones records found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.is_identification_of_agencies
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {getDisplayValue(record.is_identification_of_agencies)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.is_db_vendor_formed
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {getDisplayValue(record.is_db_vendor_formed)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(record)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(record)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteTargetId(record.id);
                            setDeleteTargetName(`Black Market Drones Record ${record.id}`);
                          }}
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
      <Tabs defaultValue="major-vendors" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="major-vendors">Major Black-Market Vendors in the Region</TabsTrigger>
          <TabsTrigger value="actions">Action Against Illegal Vendors</TabsTrigger>
        </TabsList>
        <TabsContent value="major-vendors" className="mt-4">
          <MajorBlackMarketVendors blackMarketDronesId={undefined} />
        </TabsContent>
        <TabsContent value="actions" className="mt-4">
          <ActionAgainstIllegalVendors blackMarketDronesId={undefined} />
        </TabsContent>
      </Tabs>

      <BlackMarketDronesFormModal
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
        message={`Are you sure you want to delete this record? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Black Market Drones Record"
      />
    </div>
  );
};

export default BlackMarketDrones;

