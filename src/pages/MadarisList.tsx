import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import AddMadarisModal, { MadarisFormState, ProvinceOption, DistrictOption } from '../components/modals/madaris/AddMadarisModal';
import DeleteModal from '../components/UI/DeleteModal';
import { publicApi } from '../lib/api';
import api from '../lib/api';
import { fetchLookups } from '../lib/lookups';

interface MadrasaRecord {
  id: string;
  name: string;
  reg_no: string;
  province: string;
  district: string;
  is_reg: boolean;
  school_of_thought: string;
  status: string;
  remarks?: string;
  location?: string;
  phone?: string;
  long?: string;
  lat?: string;
  reg_from_wafaq?: string;
  cooperative?: boolean;
  no_of_local_students?: number;
  category?: string;
  non_cooperation_reason?: string;
}

const buildInitialForm = (): MadarisFormState => ({
  id: undefined,
  name: '',
  reg_no: '',
  prov_id: null,
  district_id: null,
  location: '',
  phone: '',
  status: 'active',
  long: '',
  lat: '',
  is_reg: true,
  reg_from_wafaq: '',
  school_of_thought: '',
  cooperative: false,
  no_of_local_students: 0,
  category: '',
  non_cooperation_reason: '',
  remarks: '',
});

const MadarisList: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<MadarisFormState>(buildInitialForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);
  const [madaris, setMadaris] = useState<MadrasaRecord[]>([]);
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const formatStatus = (status: string) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Active';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch lookups and madaris in parallel
        const [lookupsResult, madarisResponse] = await Promise.allSettled([
          fetchLookups(),
          publicApi.get('/get-all-madaris')
        ]);

        // Handle lookups result
        if (lookupsResult.status === 'fulfilled') {
          setProvinces(lookupsResult.value.provinces || []);
          setDistricts(lookupsResult.value.districts || []);
        } else {
          console.error('Error fetching lookups:', lookupsResult.reason);
          setProvinces([]);
          setDistricts([]);
        }

        // Handle madaris response
        if (madarisResponse.status === 'fulfilled') {
          const response = madarisResponse.value;
          // Handle both response.data.data and response.data structures
          const responseData = response.data?.data || response.data || [];
          
          console.log('Madaris API response:', response);
          console.log('Madaris response data:', responseData);
          console.log('Is array:', Array.isArray(responseData));
          console.log('Number of records:', Array.isArray(responseData) ? responseData.length : 0);
          
          if (Array.isArray(responseData) && responseData.length > 0) {
            const records: MadrasaRecord[] = responseData.map((item: any) => ({
          id: item._id,
              name: item.name || '',
              reg_no: item.reg_no || '',
          province: item.prov_id?.name || '-',
          district: item.district_id?.name || '-',
          is_reg: Boolean(item.is_reg),
          school_of_thought: item.school_of_thought || '-',
          status: formatStatus(item.status),
          remarks: item.remarks || '',
          location: item.location || '',
          phone: item.phone || '',
          long: item.long || '',
          lat: item.lat || '',
          reg_from_wafaq: item.reg_from_wafaq || '',
              cooperative: Boolean(item.cooperative ?? item.cooperation_status), // Support both for backward compatibility
              no_of_local_students: item.no_of_local_students || 0,
              category: item.category || '',
              non_cooperation_reason: item.non_cooperation_reason || '',
        }));
            
            console.log('Processed madaris records:', records);
        setMadaris(records);
          } else {
            console.warn('No madaris data found or data is not an array');
            setMadaris([]);
          }
        } else {
          console.error('Error fetching madaris:', madarisResponse.reason);
          setMadaris([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitMadaris = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate non_cooperation_reason when cooperative is false
    if (!formData.cooperative && !formData.non_cooperation_reason?.trim()) {
      alert('Non Cooperation Reason is required when the institution is not cooperative.');
      return;
    }
    
    setSubmitting(true);

    try {
      // Prepare API payload
      const payload = {
        name: formData.name,
        reg_no: formData.reg_no || '',
        prov_id: formData.prov_id?._id || '',
        district_id: formData.district_id?._id || '',
        is_reg: formData.is_reg,
        school_of_thought: formData.school_of_thought || '',
        status: (formData.status || 'active').toLowerCase(), // Ensure lowercase for API
        remarks: formData.remarks || '',
        location: formData.location || '',
        phone: formData.phone || '',
        long: formData.long || '',
        lat: formData.lat || '',
        reg_from_wafaq: formData.reg_from_wafaq || '',
        cooperation_status: formData.cooperative !== undefined ? formData.cooperative : true, // Send cooperation_status to match backend API
        no_of_local_students: formData.no_of_local_students || 0,
        category: formData.category || '',
        non_cooperation_reason: formData.cooperative ? '' : (formData.non_cooperation_reason || ''), // Only send if not cooperative
      };

      let response;
      if (editingId) {
        // Update existing madaris
        const updateEndpoint = `/update-madaris/${editingId}`;
        response = await api.put(updateEndpoint, payload);
      } else {
        // Add new madaris
        const addEndpoint = '/add-madaris';
        response = await api.post(addEndpoint, payload);
      }

      // Refresh the list and lookups after successful submission
      const [lookupsResult, madarisResponse] = await Promise.all([
        fetchLookups(),
        publicApi.get('/get-all-madaris')
      ]);

      // Update lookups
      setProvinces(lookupsResult.provinces);
      setDistricts(lookupsResult.districts);

      // Process madaris records
      const records: MadrasaRecord[] = (madarisResponse.data?.data || []).map((item: any) => ({
        id: item._id,
        name: item.name,
        reg_no: item.reg_no,
        province: item.prov_id?.name || '-',
        district: item.district_id?.name || '-',
        is_reg: Boolean(item.is_reg),
        school_of_thought: item.school_of_thought || '-',
        status: formatStatus(item.status),
        remarks: item.remarks || '',
        location: item.location || '',
        phone: item.phone || '',
        long: item.long || '',
        lat: item.lat || '',
        reg_from_wafaq: item.reg_from_wafaq || '',
        cooperative: Boolean(item.cooperative ?? item.cooperation_status), // Support both for backward compatibility
        no_of_local_students: item.no_of_local_students || 0,
        category: item.category || '',
        non_cooperation_reason: item.non_cooperation_reason || '',
      }));
      setMadaris(records);

      // Close modal and reset form
      setShowAddModal(false);
      setFormData(buildInitialForm());
      setEditingId(null);
    } catch (error: any) {
      console.error('Error submitting madaris:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        `Failed to ${editingId ? 'update' : 'add'} madaris. Please try again.`
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

  const openEditModal = (record: MadrasaRecord) => {
    const provinceMatch = provinces.find((prov) => prov.name === record.province);
    const districtMatch = provinceMatch?.districts?.find((dist: DistrictOption) => dist.name === record.district)
      || districts.find((dist: DistrictOption) => dist.name === record.district);

    setEditingId(record.id);
    setFormData({
      id: record.id,
      name: record.name,
      reg_no: record.reg_no,
      prov_id: provinceMatch || null,
      district_id: districtMatch || null,
      location: record.location || '',
      phone: record.phone || '',
      status: record.status.toLowerCase(), // Convert to lowercase for API
      long: record.long || '',
      lat: record.lat || '',
      is_reg: record.is_reg,
      reg_from_wafaq: record.reg_from_wafaq || '',
      school_of_thought: record.school_of_thought,
      cooperative: record.cooperative ?? false,
      no_of_local_students: record.no_of_local_students || 0,
      category: record.category || '',
      non_cooperation_reason: record.non_cooperation_reason || '',
      remarks: record.remarks || '',
    });
    setShowAddModal(true);
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);

    try {
      // Call delete API
      const deleteEndpoint = `/delete-madaris/${id}`;
      await api.delete(deleteEndpoint);

      // Refresh the list and lookups after successful deletion
      const [lookupsResult, madarisResponse] = await Promise.all([
        fetchLookups(),
        publicApi.get('/get-all-madaris')
      ]);

      // Update lookups
      setProvinces(lookupsResult.provinces);
      setDistricts(lookupsResult.districts);

      // Process madaris records
      const records: MadrasaRecord[] = (madarisResponse.data?.data || []).map((item: any) => ({
        id: item._id,
        name: item.name,
        reg_no: item.reg_no,
        province: item.prov_id?.name || '-',
        district: item.district_id?.name || '-',
        is_reg: Boolean(item.is_reg),
        school_of_thought: item.school_of_thought || '-',
        status: formatStatus(item.status),
        remarks: item.remarks || '',
        location: item.location || '',
        phone: item.phone || '',
        long: item.long || '',
        lat: item.lat || '',
        reg_from_wafaq: item.reg_from_wafaq || '',
        cooperative: Boolean(item.cooperative ?? item.cooperation_status), // Support both for backward compatibility
        no_of_local_students: item.no_of_local_students || 0,
        category: item.category || '',
        non_cooperation_reason: item.non_cooperation_reason || '',
      }));
      setMadaris(records);

      // Close modal
      setDeleteTargetId(null);
      setDeleteTargetName(null);
    } catch (error: any) {
      console.error('Error deleting madaris:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete madaris. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const modalTitle = editingId ? 'Edit Madaris' : 'Add Madaris';
  const submitLabel = editingId ? 'Save Changes' : 'Add Madaris';

  // Filter and sort data
  const filteredAndSortedMadaris = useMemo(() => {
    let filtered = madaris;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = madaris.filter((madrasa) => {
        return (
          madrasa.name.toLowerCase().includes(searchLower) ||
          madrasa.reg_no.toLowerCase().includes(searchLower) ||
          madrasa.province.toLowerCase().includes(searchLower) ||
          madrasa.district.toLowerCase().includes(searchLower) ||
          (madrasa.is_reg ? 'registered' : 'unregistered').includes(searchLower) ||
          madrasa.school_of_thought.toLowerCase().includes(searchLower) ||
          madrasa.status.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'reg_no':
            aValue = a.reg_no.toLowerCase();
            bValue = b.reg_no.toLowerCase();
            break;
          case 'province':
            aValue = a.province.toLowerCase();
            bValue = b.province.toLowerCase();
            break;
          case 'district':
            aValue = a.district.toLowerCase();
            bValue = b.district.toLowerCase();
            break;
          case 'is_reg':
            aValue = a.is_reg ? 1 : 0;
            bValue = b.is_reg ? 1 : 0;
            break;
          case 'school_of_thought':
            aValue = a.school_of_thought.toLowerCase();
            bValue = b.school_of_thought.toLowerCase();
            break;
          case 'status':
            aValue = a.status.toLowerCase();
            bValue = b.status.toLowerCase();
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
  }, [madaris, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedMadaris = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedMadaris.slice(startIndex, endIndex);
  }, [filteredAndSortedMadaris, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedMadaris.length / itemsPerPage);

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
    setCurrentPage(1); // Reset to first page when sorting
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
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Madaris List</h2>
          <p className="text-muted-foreground">Directory of registered/unregistered madaris and their current status.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, registration, province, district, status..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
          <Button onClick={openCreateModal} className="self-start sm:self-auto">
            Add Madaris
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Institution Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Madaris Name
                    {getSortIcon('name')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('reg_no')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Registration #
                    {getSortIcon('reg_no')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('province')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Province
                    {getSortIcon('province')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('district')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    District
                    {getSortIcon('district')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('is_reg')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Registered?
                    {getSortIcon('is_reg')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('school_of_thought')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    School of Thought
                    {getSortIcon('school_of_thought')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Status
                    {getSortIcon('status')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                    Loading madaris...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedMadaris.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                    {searchTerm ? 'No madaris found matching your search.' : 'No madaris found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedMadaris.map((madrasa) => (
                  <TableRow key={madrasa.id}>
                    <TableCell>{madrasa.name}</TableCell>
                    <TableCell>{madrasa.reg_no}</TableCell>
                    <TableCell>{madrasa.province}</TableCell>
                    <TableCell>{madrasa.district}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        madrasa.is_reg
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                      }`}>
                        {madrasa.is_reg ? 'Registered' : 'Unregistered'}
                      </span>
                    </TableCell>
                    <TableCell>{madrasa.school_of_thought}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        madrasa.status === 'Active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : madrasa.status === 'Inactive'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                      }`}>
                        {madrasa.status || 'Active'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/madaris/details?id=${madrasa.id}`)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditModal(madrasa)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeleteTargetId(madrasa.id);
                            setDeleteTargetName(madrasa.name);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {filteredAndSortedMadaris.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedMadaris.length)} of {filteredAndSortedMadaris.length} entries
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
                    // Show first page, last page, current page, and pages around current
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

      <AddMadarisModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitMadaris}
        provinces={provinces}
        title={modalTitle}
        submitLabel={submitLabel}
        submitting={submitting}
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
        message={`Are you sure you want to delete "${deleteTargetName}" from the madaris list? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Institution"
      />
    </div>
  );
};

export default MadarisList;

