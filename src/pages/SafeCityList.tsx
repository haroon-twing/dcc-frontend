import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import SafeCityFormModal, { SafeCityFormState } from '../components/modals/safecity/SafeCityFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import { fetchLookups, fetchCities, type ProvinceOption, type DistrictOption, type CityOption } from '../lib/lookups';
import { publicApi } from '../lib/api';
import api from '../lib/api';

interface SafeCityRecord {
  id: string;
  province_id: string;
  district_id: string;
  city_id: string;
  approval_date: string;
  present_status: string;
  per_present_status?: number;
  no_of_total_cameras: number;
  active_cameras: number;
  inactive_cameras: number;
  fr_cameras: number;
  non_fr_cameras: number;
  no_of_employees: number;
  remarks: string;
  province?: string;
  district?: string;
  city?: string;
}

const buildInitialForm = (): SafeCityFormState => ({
  id: undefined,
  province_id: null,
  district_id: null,
  city_id: null,
  approval_date: '',
  present_status: '',
  per_present_status: undefined,
  no_of_total_cameras: 0,
  active_cameras: 0,
  inactive_cameras: 0,
  fr_cameras: 0,
  non_fr_cameras: 0,
  no_of_employees: 0,
  remarks: '',
});

const SafeCityList: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<SafeCityFormState>(buildInitialForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);
  const [safeCities, setSafeCities] = useState<SafeCityRecord[]>([]);
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const fetchSafeCities = useCallback(async () => {
    try {
      const response = await publicApi.get('/safecity/get-safecitymains');
      const data = response.data?.data || response.data || [];
      
      // Get the province, district, and city IDs from the response
      const records: SafeCityRecord[] = data.map((item: any) => {
        const provinceId = item.province_id?._id || item.province_id || '';
        const districtId = item.district_id?._id || item.district_id || '';
        const cityId = item.city_id?._id || item.city_id || '';
        
        // Find the names from the loaded lookups
        const province = provinces.find(p => p._id === provinceId);
        const district = districts.find(d => d._id === districtId);
        const city = cities.find(c => c._id === cityId);
        
        return {
          id: item._id || item.id,
          province_id: provinceId,
          district_id: districtId,
          city_id: cityId,
          approval_date: item.approval_date || '',
          present_status: item.present_status || '',
          per_present_status: item.per_present_status,
          no_of_total_cameras: item.no_of_total_cameras || 0,
          active_cameras: item.active_cameras || 0,
          inactive_cameras: item.inactive_cameras || 0,
          fr_cameras: item.fr_cameras || 0,
          non_fr_cameras: item.non_fr_cameras || 0,
          no_of_employees: item.no_of_employees || 0,
          remarks: item.remarks || '',
          province: province?.name || item.province_id?.name || '-',
          district: district?.name || item.district_id?.name || '-',
          city: city?.name || item.city_id?.name || '-',
        };
      });
      setSafeCities(records);
    } catch (error) {
      console.error('Error fetching safe cities:', error);
    }
  }, [provinces, districts, cities]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch lookups first (provinces, districts, cities)
        const [lookupsResult, citiesList] = await Promise.all([
          fetchLookups(),
          fetchCities(),
        ]);
        
        setProvinces(lookupsResult.provinces);
        setDistricts(lookupsResult.districts);
        setCities(citiesList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch safe cities after lookups are loaded
  useEffect(() => {
    if (provinces.length > 0 && districts.length > 0 && cities.length > 0) {
      fetchSafeCities();
    }
  }, [provinces, districts, cities, fetchSafeCities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: any = {
        province_id: formData.province_id?._id || '',
        district_id: formData.district_id?._id || '',
        city_id: formData.city_id?._id || '',
        approval_date: formData.approval_date,
        present_status: formData.present_status,
        no_of_total_cameras: formData.no_of_total_cameras,
        active_cameras: formData.active_cameras,
        inactive_cameras: formData.inactive_cameras,
        fr_cameras: formData.fr_cameras,
        non_fr_cameras: formData.non_fr_cameras,
        no_of_employees: formData.no_of_employees,
        remarks: formData.remarks || '',
      };

      // Only include per_present_status if status is "in progress"
      if (formData.present_status === 'in progress' && formData.per_present_status !== undefined) {
        payload.per_present_status = formData.per_present_status;
      }

      if (editingId) {
        await api.put(`/safecity/update-safecitymain/${editingId}`, payload);
      } else {
        await api.post('/safecity/add-safecitymain', payload);
      }

      // Refresh the list after successful operation
      await fetchSafeCities();

      setShowAddModal(false);
      setFormData(buildInitialForm());
      setEditingId(null);
      alert(editingId ? 'Safe City updated successfully!' : 'Safe City added successfully!');
    } catch (error: any) {
      console.error('Error submitting safe city:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        `Failed to ${editingId ? 'update' : 'add'} safe city. Please try again.`
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

  const handleEdit = async (record: SafeCityRecord) => {
    // Ensure lookups are loaded before editing
    if (provinces.length === 0 || districts.length === 0 || cities.length === 0) {
      try {
        const [lookupsResult, citiesList] = await Promise.all([
          fetchLookups(),
          fetchCities(),
        ]);
        setProvinces(lookupsResult.provinces);
        setDistricts(lookupsResult.districts);
        setCities(citiesList);
      } catch (error) {
        console.error('Error loading lookups for edit:', error);
        alert('Failed to load form data. Please try again.');
        return;
      }
    }

    const provinceMatch = provinces.find((prov) => prov._id === record.province_id);
    const districtMatch = districts.find((dist) => dist._id === record.district_id);
    const cityMatch = cities.find((city) => city._id === record.city_id);

    setEditingId(record.id);
    setFormData({
      id: record.id,
      province_id: provinceMatch || null,
      district_id: districtMatch || null,
      city_id: cityMatch || null,
      approval_date: record.approval_date,
      present_status: record.present_status,
      per_present_status: record.per_present_status,
      no_of_total_cameras: record.no_of_total_cameras,
      active_cameras: record.active_cameras,
      inactive_cameras: record.inactive_cameras,
      fr_cameras: record.fr_cameras,
      non_fr_cameras: record.non_fr_cameras,
      no_of_employees: record.no_of_employees,
      remarks: record.remarks || '',
    });
    setShowAddModal(true);
  };

  const handleView = (record: SafeCityRecord) => {
    navigate(`/safe-city/details?id=${record.id}`);
  };

  const handleDelete = (record: SafeCityRecord) => {
    setDeleteTargetId(record.id);
    setDeleteTargetName(record.city || record.city_id || 'Safe City');
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      await api.delete(`/safecity/delete-safecitymain/${id}`);
      
      // Refresh the list after successful deletion
      await fetchSafeCities();

      setDeleteTargetId(null);
      setDeleteTargetName(null);
      alert('Safe City deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting safe city:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete safe city. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    }
    return <ArrowDown className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Filter and sort data
  const filteredAndSortedSafeCities = useMemo(() => {
    let filtered = safeCities;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = safeCities.filter((record) => {
        return (
          record.city?.toLowerCase().includes(searchLower) ||
          record.province?.toLowerCase().includes(searchLower) ||
          record.district?.toLowerCase().includes(searchLower) ||
          record.present_status.toLowerCase().includes(searchLower) ||
          record.remarks.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = (a as any)[sortColumn];
        let bValue: any = (b as any)[sortColumn];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [safeCities, searchTerm, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSafeCities.length / itemsPerPage);
  const paginatedSafeCities = filteredAndSortedSafeCities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Safe City List</h2>
          <p className="text-muted-foreground">Manage Safe City surveillance projects</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-foreground"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Safe City Records</CardTitle>
            <Button onClick={openCreateModal} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Safe City
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <div className="w-full">
                <Table className="w-full">
                  <colgroup>
                    <col className="w-[8%]" />
                    <col className="w-[8%]" />
                    <col className="w-[8%]" />
                    <col className="w-[8%]" />
                    <col className="w-[8%]" />
                    <col className="w-[7%]" />
                    <col className="w-[7%]" />
                    <col className="w-[7%]" />
                    <col className="w-[7%]" />
                    <col className="w-[7%]" />
                    <col className="w-[7%]" />
                    <col className="w-[8%]" />
                  </colgroup>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button
                          onClick={() => handleSort('province')}
                          className="flex items-center gap-2 hover:text-foreground w-full text-left"
                        >
                          Province {getSortIcon('province')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('district')}
                          className="flex items-center gap-2 hover:text-foreground w-full text-left"
                        >
                          District {getSortIcon('district')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('city')}
                          className="flex items-center gap-2 hover:text-foreground w-full text-left"
                        >
                          City {getSortIcon('city')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('approval_date')}
                          className="flex items-center gap-2 hover:text-foreground w-full text-left"
                        >
                          Approval Date {getSortIcon('approval_date')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('present_status')}
                          className="flex items-center gap-2 hover:text-foreground w-full text-left"
                        >
                          Status {getSortIcon('present_status')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('no_of_total_cameras')}
                          className="flex items-center gap-2 hover:text-foreground w-full text-left"
                        >
                          Total Cameras {getSortIcon('no_of_total_cameras')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('active_cameras')}
                          className="flex items-center gap-2 hover:text-foreground w-full text-left"
                        >
                          Active Cameras {getSortIcon('active_cameras')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('inactive_cameras')}
                          className="flex items-center gap-2 hover:text-foreground w-full text-left"
                        >
                          Inactive Cameras {getSortIcon('inactive_cameras')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('fr_cameras')}
                          className="flex items-center gap-2 hover:text-foreground w-full text-left"
                        >
                          FR Cameras {getSortIcon('fr_cameras')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('non_fr_cameras')}
                          className="flex items-center gap-2 hover:text-foreground w-full text-left"
                        >
                          Non-FR Cameras {getSortIcon('non_fr_cameras')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('no_of_employees')}
                          className="flex items-center gap-2 hover:text-foreground w-full text-left"
                        >
                          Employees {getSortIcon('no_of_employees')}
                        </button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSafeCities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                          {searchTerm ? 'No records found matching your search.' : 'No Safe City records found.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedSafeCities.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="truncate" title={record.province || '-'}>
                            {record.province || '-'}
                          </TableCell>
                          <TableCell className="truncate" title={record.district || '-'}>
                            {record.district || '-'}
                          </TableCell>
                          <TableCell className="truncate" title={record.city || record.city_id || '-'}>
                            {record.city || record.city_id || '-'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(record.approval_date)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                record.present_status === 'in progress'
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                  : record.present_status === 'pending'
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                  : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                              }`}
                            >
                              {record.present_status ? record.present_status.charAt(0).toUpperCase() + record.present_status.slice(1) : 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-center">
                            {record.no_of_total_cameras}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-center">
                            {record.active_cameras}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-center">
                            {record.inactive_cameras}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-center">
                            {record.fr_cameras}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-center">
                            {record.non_fr_cameras}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-center">
                            {record.no_of_employees}
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
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedSafeCities.length)} of {filteredAndSortedSafeCities.length} records
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <SafeCityFormModal
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
        title={editingId ? 'Edit Safe City' : 'Add Safe City'}
        submitLabel={editingId ? 'Save Changes' : 'Add Safe City'}
        submitting={submitting}
      />

      <DeleteModal
        open={!!deleteTargetId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTargetId(null);
            setDeleteTargetName(null);
          }
        }}
        id={deleteTargetId || ''}
        message={`Are you sure you want to delete "${deleteTargetName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Safe City"
      />
    </div>
  );
};

export default SafeCityList;

