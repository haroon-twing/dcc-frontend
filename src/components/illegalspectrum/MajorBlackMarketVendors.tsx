import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import MajorBlackMarketVendorFormModal from '../modals/illegalspectrum/MajorBlackMarketVendorFormModal';
import DeleteModal from '../UI/DeleteModal';

interface MajorBlackMarketVendor {
  _id?: string;
  id?: string;
  name: string;
  present_address: string;
  domicile: string;
  is_fam_mem_terr: boolean;
  affiliation_with_terr_grp: string;
  main_trade: string;
  major_areas_supply: string;
  remarks: string;
}

interface MajorBlackMarketVendorsProps {
  blackMarketDronesId?: string;
}

export interface MajorBlackMarketVendorFormState {
  id?: string;
  name: string;
  present_address: string;
  domicile: string;
  is_fam_mem_terr: boolean;
  affiliation_with_terr_grp: string;
  main_trade: string;
  major_areas_supply: string;
  remarks: string;
}

const MajorBlackMarketVendors: React.FC<MajorBlackMarketVendorsProps> = ({ blackMarketDronesId }) => {
  const [records, setRecords] = useState<MajorBlackMarketVendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<MajorBlackMarketVendor | null>(null);
  const [viewingRecord, setViewingRecord] = useState<MajorBlackMarketVendor | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
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
  
  const buildInitialForm = (): MajorBlackMarketVendorFormState => ({
    id: undefined,
    name: '',
    present_address: '',
    domicile: '',
    is_fam_mem_terr: false,
    affiliation_with_terr_grp: '',
    main_trade: '',
    major_areas_supply: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<MajorBlackMarketVendorFormState>(buildInitialForm());

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint when available
      // const endpoint = blackMarketDronesId
      //   ? `/black-market-drones/get-all-major-vendors/${blackMarketDronesId}`
      //   : '/black-market-drones/get-all-major-vendors';
      // const response = await publicApi.get(endpoint);
      // const data = response.data?.data || response.data || [];
      
      // For now, using empty array
      const data: any[] = [];
      
      const records: MajorBlackMarketVendor[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        name: item.name || '',
        present_address: item.present_address || '',
        domicile: item.domicile || '',
        is_fam_mem_terr: Boolean(item.is_fam_mem_terr),
        affiliation_with_terr_grp: item.affiliation_with_terr_grp || '',
        main_trade: item.main_trade || '',
        major_areas_supply: item.major_areas_supply || '',
        remarks: item.remarks || '',
      }));
      
      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching major black market vendors:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [blackMarketDronesId]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingRecord(null);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = async (record: MajorBlackMarketVendor) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      return;
    }

    setViewingRecord(record);
    setEditingRecord(null);
    setIsViewMode(true);
    setFormData({
      id: recordId,
      name: record.name,
      present_address: record.present_address,
      domicile: record.domicile,
      is_fam_mem_terr: record.is_fam_mem_terr,
      affiliation_with_terr_grp: record.affiliation_with_terr_grp,
      main_trade: record.main_trade,
      major_areas_supply: record.major_areas_supply,
      remarks: record.remarks,
    });
    setShowModal(true);
  };

  const handleEdit = (record: MajorBlackMarketVendor) => {
    const recordId = record._id || record.id;
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setFormData({
      id: recordId,
      name: record.name,
      present_address: record.present_address,
      domicile: record.domicile,
      is_fam_mem_terr: record.is_fam_mem_terr,
      affiliation_with_terr_grp: record.affiliation_with_terr_grp,
      main_trade: record.main_trade,
      major_areas_supply: record.major_areas_supply,
      remarks: record.remarks,
    });
    setShowModal(true);
  };

  const handleDelete = (record: MajorBlackMarketVendor) => {
    const recordId = record._id || record.id;
    setRecordToDeleteId(recordId);
    setRecordToDeleteName(record.name);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        present_address: formData.present_address,
        domicile: formData.domicile,
        is_fam_mem_terr: formData.is_fam_mem_terr,
        affiliation_with_terr_grp: formData.affiliation_with_terr_grp,
        main_trade: formData.main_trade,
        major_areas_supply: formData.major_areas_supply,
        remarks: formData.remarks,
        ...(blackMarketDronesId && { black_market_drones_id: blackMarketDronesId }),
      };

      if (editingRecord) {
        // TODO: Replace with actual API endpoint when available
        // await api.put(`/black-market-drones/update-major-vendor/${formData.id}`, payload);
        console.log('Update major black market vendor:', formData.id, payload);
      } else {
        // TODO: Replace with actual API endpoint when available
        // await api.post('/black-market-drones/add-major-vendor', payload);
        console.log('Add major black market vendor:', payload);
      }

      await fetchRecords();
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
      setViewingRecord(null);
      setIsViewMode(false);
    } catch (error: any) {
      console.error('Error submitting major black market vendor:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} major black market vendor. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      // TODO: Replace with actual API endpoint when available
      // await api.delete(`/black-market-drones/delete-major-vendor/${id}`);
      console.log('Delete major black market vendor:', id);

      await fetchRecords();
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
    } catch (error: any) {
      console.error('Error deleting major black market vendor:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete major black market vendor. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = records.filter((record) => {
        return (
          record.name.toLowerCase().includes(searchLower) ||
          record.present_address.toLowerCase().includes(searchLower) ||
          record.domicile.toLowerCase().includes(searchLower) ||
          record.affiliation_with_terr_grp.toLowerCase().includes(searchLower) ||
          record.main_trade.toLowerCase().includes(searchLower)
        );
      });
    }

    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = (a as any)[sortColumn];
        let bValue: any = (b as any)[sortColumn];

        if (typeof aValue === 'boolean') {
          aValue = aValue ? 1 : 0;
          bValue = bValue ? 1 : 0;
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Major Black-Market Vendors in the Region</CardTitle>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Major Black-Market Vendor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, address, trade..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Name
                    {getSortIcon('name')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('present_address')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Present Address
                    {getSortIcon('present_address')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('main_trade')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Main Trade
                    {getSortIcon('main_trade')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('affiliation_with_terr_grp')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Affiliation
                    {getSortIcon('affiliation_with_terr_grp')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    Loading major black market vendors...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No major black market vendors found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.present_address}</TableCell>
                    <TableCell>{record.main_trade || '-'}</TableCell>
                    <TableCell>{record.affiliation_with_terr_grp || '-'}</TableCell>
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
                          onClick={() => handleEdit(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(record)}
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

      <MajorBlackMarketVendorFormModal
        open={showModal}
        onOpenChange={(open) => {
          if (!open && !submitting) {
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
        title={isViewMode ? 'View Major Black-Market Vendor' : editingRecord ? 'Edit Major Black-Market Vendor' : 'Add Major Black-Market Vendor'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Major Black-Market Vendor'}
        submitting={submitting}
        viewMode={isViewMode}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={recordToDeleteId}
        message={`Are you sure you want to delete "${recordToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Major Black-Market Vendor"
      />
    </>
  );
};

export default MajorBlackMarketVendors;

