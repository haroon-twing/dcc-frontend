import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import MajorExtortionistFormModal from '../modals/illegalspectrum/MajorExtortionistFormModal';
import DeleteModal from '../UI/DeleteModal';

interface MajorExtortionist {
  _id?: string;
  id?: string;
  name: string;
  present_Residence: string;
  domicile: string;
  mob_no: string;
  is_any_fam_mem_terr: boolean;
  affilication_with_terr_grp: string;
  model_ext: string;
  maj_tgt: string;
  remarks: string;
}

interface MajorExtortionistsProps {
  extortionId?: string;
}

export interface MajorExtortionistFormState {
  id?: string;
  name: string;
  present_Residence: string;
  domicile: string;
  mob_no: string;
  is_any_fam_mem_terr: boolean;
  affilication_with_terr_grp: string;
  model_ext: string;
  maj_tgt: string;
  remarks: string;
}

const MajorExtortionists: React.FC<MajorExtortionistsProps> = ({ extortionId }) => {
  const [records, setRecords] = useState<MajorExtortionist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<MajorExtortionist | null>(null);
  const [viewingRecord, setViewingRecord] = useState<MajorExtortionist | null>(null);
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
  
  const buildInitialForm = (): MajorExtortionistFormState => ({
    id: undefined,
    name: '',
    present_Residence: '',
    domicile: '',
    mob_no: '',
    is_any_fam_mem_terr: false,
    affilication_with_terr_grp: '',
    model_ext: '',
    maj_tgt: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<MajorExtortionistFormState>(buildInitialForm());

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint when available
      // const endpoint = extortionId 
      //   ? `/extortion/get-all-major-extortionists/${extortionId}`
      //   : '/extortion/get-all-major-extortionists';
      // const response = await publicApi.get(endpoint);
      // const data = response.data?.data || response.data || [];
      
      // For now, using empty array
      const data: any[] = [];
      
      const records: MajorExtortionist[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        name: item.name || '',
        present_Residence: item.present_Residence || '',
        domicile: item.domicile || '',
        mob_no: item.mob_no || '',
        is_any_fam_mem_terr: Boolean(item.is_any_fam_mem_terr),
        affilication_with_terr_grp: item.affilication_with_terr_grp || '',
        model_ext: item.model_ext || '',
        maj_tgt: item.maj_tgt || '',
        remarks: item.remarks || '',
      }));
      
      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching major extortionists:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [extortionId]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingRecord(null);
    setViewingRecord(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = async (record: MajorExtortionist) => {
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
      present_Residence: record.present_Residence,
      domicile: record.domicile,
      mob_no: record.mob_no,
      is_any_fam_mem_terr: record.is_any_fam_mem_terr,
      affilication_with_terr_grp: record.affilication_with_terr_grp,
      model_ext: record.model_ext,
      maj_tgt: record.maj_tgt,
      remarks: record.remarks,
    });
    setShowModal(true);
  };

  const handleEdit = (record: MajorExtortionist) => {
    const recordId = record._id || record.id;
    setEditingRecord(record);
    setViewingRecord(null);
    setIsViewMode(false);
    setFormData({
      id: recordId,
      name: record.name,
      present_Residence: record.present_Residence,
      domicile: record.domicile,
      mob_no: record.mob_no,
      is_any_fam_mem_terr: record.is_any_fam_mem_terr,
      affilication_with_terr_grp: record.affilication_with_terr_grp,
      model_ext: record.model_ext,
      maj_tgt: record.maj_tgt,
      remarks: record.remarks,
    });
    setShowModal(true);
  };

  const handleDelete = (record: MajorExtortionist) => {
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
        present_Residence: formData.present_Residence,
        domicile: formData.domicile,
        mob_no: formData.mob_no,
        is_any_fam_mem_terr: formData.is_any_fam_mem_terr,
        affilication_with_terr_grp: formData.affilication_with_terr_grp,
        model_ext: formData.model_ext,
        maj_tgt: formData.maj_tgt,
        remarks: formData.remarks,
        ...(extortionId && { extortion_id: extortionId }),
      };

      if (editingRecord) {
        // TODO: Replace with actual API endpoint when available
        // await api.put(`/extortion/update-major-extortionist/${formData.id}`, payload);
        console.log('Update major extortionist:', formData.id, payload);
      } else {
        // TODO: Replace with actual API endpoint when available
        // await api.post('/extortion/add-major-extortionist', payload);
        console.log('Add major extortionist:', payload);
      }

      await fetchRecords();
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
      setViewingRecord(null);
      setIsViewMode(false);
    } catch (error: any) {
      console.error('Error submitting major extortionist:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} major extortionist. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      // TODO: Replace with actual API endpoint when available
      // await api.delete(`/extortion/delete-major-extortionist/${id}`);
      console.log('Delete major extortionist:', id);

      await fetchRecords();
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
    } catch (error: any) {
      console.error('Error deleting major extortionist:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete major extortionist. Please try again.'
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
          record.present_Residence.toLowerCase().includes(searchLower) ||
          record.domicile.toLowerCase().includes(searchLower) ||
          record.mob_no.toLowerCase().includes(searchLower) ||
          record.affilication_with_terr_grp.toLowerCase().includes(searchLower)
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
            <CardTitle>Major Extortionists in the Region</CardTitle>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Major Extortionist
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, residence, mobile number..."
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
                    onClick={() => handleSort('present_Residence')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Present Residence
                    {getSortIcon('present_Residence')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('mob_no')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Mobile Number
                    {getSortIcon('mob_no')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('affilication_with_terr_grp')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Affiliation
                    {getSortIcon('affilication_with_terr_grp')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('maj_tgt')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Major Target
                    {getSortIcon('maj_tgt')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    Loading major extortionists...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No major extortionists found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.present_Residence}</TableCell>
                    <TableCell>{record.mob_no}</TableCell>
                    <TableCell>{record.affilication_with_terr_grp || '-'}</TableCell>
                    <TableCell>{record.maj_tgt || '-'}</TableCell>
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

      <MajorExtortionistFormModal
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
        title={isViewMode ? 'View Major Extortionist' : editingRecord ? 'Edit Major Extortionist' : 'Add Major Extortionist'}
        submitLabel={editingRecord ? 'Save Changes' : 'Add Major Extortionist'}
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
        title="Delete Major Extortionist"
      />
    </>
  );
};

export default MajorExtortionists;

