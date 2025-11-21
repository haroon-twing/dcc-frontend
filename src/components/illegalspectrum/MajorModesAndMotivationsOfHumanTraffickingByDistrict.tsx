import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { Eye, Edit, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import MajorModesAndMotivationsOfHumanTraffickingByDistrictFormModal from '../modals/illegalspectrum/MajorModesAndMotivationsOfHumanTraffickingByDistrictFormModal';
import DeleteModal from '../UI/DeleteModal';

interface MajorModesAndMotivationsOfHumanTraffickingByDistrict {
  _id?: string;
  id?: string;
  dist_id: string;
  per_pop_trafficked_last_month: number;
  modes_ht: string;
  motivation_ht: string;
  remarks: string;
}

interface MajorModesAndMotivationsOfHumanTraffickingByDistrictProps {
  humanTraffickingId?: string;
}

export interface MajorModesAndMotivationsOfHumanTraffickingByDistrictFormState {
  id?: string;
  dist_id: string;
  per_pop_trafficked_last_month: number;
  modes_ht: string;
  motivation_ht: string;
  remarks: string;
}

const MajorModesAndMotivationsOfHumanTraffickingByDistrict: React.FC<MajorModesAndMotivationsOfHumanTraffickingByDistrictProps> = ({ humanTraffickingId }) => {
  const [records, setRecords] = useState<MajorModesAndMotivationsOfHumanTraffickingByDistrict[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<MajorModesAndMotivationsOfHumanTraffickingByDistrict | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
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
  
  const buildInitialForm = (): MajorModesAndMotivationsOfHumanTraffickingByDistrictFormState => ({
    id: undefined,
    dist_id: '',
    per_pop_trafficked_last_month: 0,
    modes_ht: '',
    motivation_ht: '',
    remarks: '',
  });

  const [formData, setFormData] = useState<MajorModesAndMotivationsOfHumanTraffickingByDistrictFormState>(buildInitialForm());

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const response = await publicApi.get('/ispec-ht-modes-motivation-by-dist/get-all-ispec-ht-modes-motivation-by-dist');
      let data = response.data;
      if (Array.isArray(data)) {
        data = { data };
      }

      const dataArray = data?.data || data || [];

      const records: MajorModesAndMotivationsOfHumanTraffickingByDistrict[] = dataArray.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        dist_id: item.dist_id || '',
        per_pop_trafficked_last_month: item.per_pop_trafficked_last_month || 0,
        modes_ht: item.modes_ht || '',
        motivation_ht: item.motivation_ht || '',
        remarks: item.remarks || '',
      }));

      setRecords(records);
    } catch (err: any) {
      console.error('Error fetching major modes and motivations of human trafficking by district:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [humanTraffickingId]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingRecord(null);
    setShowModal(true);
  };

  const navigate = useNavigate();

  const handleView = (record: MajorModesAndMotivationsOfHumanTraffickingByDistrict) => {
    const recordId = record._id || record.id;
    if (!recordId) {
      console.error('No record ID found for viewing');
      return;
    }
    navigate(`/illegal-spectrum/major-modes-view/${recordId}`);
  };

  const handleEdit = (record: MajorModesAndMotivationsOfHumanTraffickingByDistrict) => {
    const recordId = record._id || record.id;
    setEditingRecord(record);
    setFormData({
      id: recordId,
      dist_id: record.dist_id,
      per_pop_trafficked_last_month: record.per_pop_trafficked_last_month,
      modes_ht: record.modes_ht,
      motivation_ht: record.motivation_ht,
      remarks: record.remarks,
    });
    setShowModal(true);
  };


  const handleDelete = (record: MajorModesAndMotivationsOfHumanTraffickingByDistrict) => {
    const recordId = record._id || record.id;
    setRecordToDeleteId(recordId);
    setRecordToDeleteName('District');
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        dist_id: formData.dist_id,
        per_pop_trafficked_last_month: formData.per_pop_trafficked_last_month,
        modes_ht: formData.modes_ht,
        motivation_ht: formData.motivation_ht,
        remarks: formData.remarks,
        ...(humanTraffickingId && { human_trafficking_id: humanTraffickingId }),
      };

      if (editingRecord) {
        const recordId = formData.id || editingRecord._id || editingRecord.id;
        if (!recordId) {
          throw new Error('Record ID is required for update');
        }
        console.log('Updating major modes and motivations of human trafficking by district:', recordId, payload);
        const response = await api.put(`/ispec-ht-modes-motivation-by-dist/update-ispec-ht-modes-motivation-by-dist/${recordId}`, payload);
        console.log('Update response:', response);
        window.alert('Record updated successfully!');
      } else {
        console.log('Adding major modes and motivations of human trafficking by district:', payload);
        const response = await api.post('/ispec-ht-modes-motivation-by-dist/add-ispec-ht-modes-motivation-by-dist', payload);
        console.log('Add response:', response);
        window.alert('Record added successfully!');
      }

      await fetchRecords();
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingRecord(null);
    } catch (error: any) {
      console.error('Error submitting major modes and motivations of human trafficking by district:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${editingRecord ? 'update' : 'add'} major modes and motivations of human trafficking by district. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      console.log('Deleting major modes and motivations of human trafficking by district:', id);
      await api.delete(`/ispec-ht-modes-motivation-by-dist/delete-ispec-ht-modes-motivation-by-dist/${id}`);
      console.log('Delete response: success');

      await fetchRecords();
      setShowDeleteModal(false);
      setRecordToDeleteId(undefined);
      setRecordToDeleteName('');
      window.alert('Record deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting major modes and motivations of human trafficking by district:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete major modes and motivations of human trafficking by district. Please try again.'
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
          record.dist_id.toLowerCase().includes(searchLower) ||
          record.modes_ht.toLowerCase().includes(searchLower) ||
          record.motivation_ht.toLowerCase().includes(searchLower)
        );
      });
    }

    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = (a as any)[sortColumn];
        let bValue: any = (b as any)[sortColumn];

        if (typeof aValue === 'number') {
          // Keep as number
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
            <CardTitle>Major Modes and Motivations of Human Trafficking by District</CardTitle>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Major Modes and Motivations by District
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by district ID, modes, motivations..."
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
                    onClick={() => handleSort('dist_id')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    District ID
                    {getSortIcon('dist_id')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('per_pop_trafficked_last_month')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    % Population Trafficked (Last Month)
                    {getSortIcon('per_pop_trafficked_last_month')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('modes_ht')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Modes of HT
                    {getSortIcon('modes_ht')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('motivation_ht')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Motivation of HT
                    {getSortIcon('motivation_ht')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    Loading major modes and motivations of human trafficking by district...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No records found matching your search.' : 'No major modes and motivations of human trafficking by district found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record._id || record.id}>
                    <TableCell>{record.dist_id}</TableCell>
                    <TableCell>{record.per_pop_trafficked_last_month.toFixed(1)}%</TableCell>
                    <TableCell>{record.modes_ht || '-'}</TableCell>
                    <TableCell>{record.motivation_ht || '-'}</TableCell>
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

      <MajorModesAndMotivationsOfHumanTraffickingByDistrictFormModal
        open={showModal}
        onOpenChange={(open) => {
          if (!open && !submitting) {
            setShowModal(false);
            setEditingRecord(null);
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={editingRecord ? 'Edit Record' : 'Add New Record'}
        submitLabel={editingRecord ? 'Update' : 'Add'}
        submitting={submitting}
        viewMode={false}
      />

      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={recordToDeleteId}
        message={`Are you sure you want to delete "${recordToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Major Modes and Motivations of Human Trafficking by District"
      />
    </>
  );
};

export default MajorModesAndMotivationsOfHumanTraffickingByDistrict;

