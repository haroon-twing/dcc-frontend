import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import NGOFormModal, { NGOFormState } from '../components/modals/ngo/NGOFormModal';
import DeleteModal from '../components/UI/DeleteModal';
import { publicApi } from '../lib/api';
import api from '../lib/api';
import { fetchLookups, type DistrictOption } from '../lib/lookups';

interface NGORecord {
  _id?: string;
  id?: string;
  name: string;
  field_of_work: string;
  operating_area_district_id: string | null;
  operating_area_district_name?: string;
  funding_source: string;
  known_affiliate_linkage?: string;
  ngo_category?: string;
  ngo_risk_level?: string;
  is_involve_financial_irregularities: boolean;
  is_against_national_interest: boolean;
  nature_of_anti_national_activity?: string;
  remarks?: string;
}

const buildInitialForm = (): NGOFormState => ({
  name: '',
  field_of_work: '',
  operating_area_district_id: null,
  funding_source: '',
  known_affiliate_linkage: '',
  ngo_category: '',
  ngo_risk_level: '',
  is_involve_financial_irregularities: false,
  is_against_national_interest: false,
  nature_of_anti_national_activity: '',
  remarks: '',
});

const NGOList: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<NGOFormState>(buildInitialForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);
  const [ngos, setNgos] = useState<NGORecord[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loadingRecord, setLoadingRecord] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load districts lookup first
        const lookups = await fetchLookups();
        setDistricts(lookups.districts || []);
      } catch (error) {
        console.error('Error loading districts:', error);
      }
    };
    loadData();
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      setLoading(true);
      const response = await publicApi.get('/ngo-main/get-all-ngo-main');
      const data = response.data?.data || response.data || [];
      
      console.log('Fetched NGOs data:', data);
      
      // Load districts if not already loaded
      let districtsList = districts;
      if (districtsList.length === 0) {
        const lookups = await fetchLookups();
        districtsList = lookups.districts || [];
        setDistricts(districtsList);
      }
      
      const ngosData: NGORecord[] = data.map((item: any) => {
        // Handle district - can be an object, ID string, or null
        let districtId: string | null = null;
        let districtName: string | undefined = undefined;
        
        if (item.operating_area_district_id) {
          // If it's an object with _id or id property
          if (typeof item.operating_area_district_id === 'object') {
            districtId = item.operating_area_district_id._id || item.operating_area_district_id.id || null;
            districtName = item.operating_area_district_id.name;
          } else {
            // It's a string ID
            districtId = item.operating_area_district_id;
          }
        } else if (item.operating_area_district) {
          // Handle operating_area_district object
          if (typeof item.operating_area_district === 'object' && item.operating_area_district._id) {
            districtId = item.operating_area_district._id || item.operating_area_district.id || null;
            districtName = item.operating_area_district.name;
          }
        }
        
        // Find district name from lookup if not already set
        if (districtId && !districtName) {
          const district = districtsList.find(d => d._id === districtId);
          districtName = district?.name;
        }
        
        return {
          _id: item._id || item.id,
          id: item._id || item.id,
          name: item.name || '',
          field_of_work: item.field_of_work || '',
          operating_area_district_id: districtId,
          operating_area_district_name: districtName,
          funding_source: item.funding_source || '',
          known_affiliate_linkage: item.known_affiliate_linkage || '',
          ngo_category: item.ngo_category || '',
          ngo_risk_level: item.ngo_risk_level || '',
          is_involve_financial_irregularities: item.is_involve_financial_irregularities || false,
          is_against_national_interest: item.is_against_national_interest || false,
          nature_of_anti_national_activity: item.nature_of_anti_national_activity || '',
          remarks: item.remarks || '',
        };
      });
      
      setNgos(ngosData);
    } catch (err: any) {
      console.error('Error fetching NGOs:', err);
      window.alert(err?.response?.data?.message || err?.message || 'Failed to load NGOs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = async (ngo: NGORecord) => {
    const ngoId = ngo._id || ngo.id;
    if (!ngoId) {
      window.alert('NGO ID is missing. Cannot load NGO details.');
      return;
    }

    setLoadingRecord(true);
    setEditingId(ngoId);
    
    try {
      // TODO: Replace with actual API endpoint when available
      // const response = await publicApi.get(`/ngo/get-single-ngo/${ngoId}`);
      // const ngoData = response.data?.data || response.data;
      
      // For now, use the NGO data directly
      const ngoData = ngo;
      
      setFormData({
        name: ngoData.name || '',
        field_of_work: ngoData.field_of_work || '',
        operating_area_district_id: ngoData.operating_area_district_id || null,
        funding_source: ngoData.funding_source || '',
        known_affiliate_linkage: ngoData.known_affiliate_linkage || '',
        ngo_category: ngoData.ngo_category || '',
        ngo_risk_level: ngoData.ngo_risk_level || '',
        is_involve_financial_irregularities: ngoData.is_involve_financial_irregularities || false,
        is_against_national_interest: ngoData.is_against_national_interest || false,
        nature_of_anti_national_activity: ngoData.nature_of_anti_national_activity || '',
        remarks: ngoData.remarks || '',
      });
      
      setShowModal(true);
    } catch (err: any) {
      console.error('Error loading NGO for edit:', err);
      window.alert('Failed to load NGO data. Please try again.');
    } finally {
      setLoadingRecord(false);
    }
  };

  const handleView = (ngo: NGORecord) => {
    const ngoId = ngo._id || ngo.id;
    if (!ngoId) {
      window.alert('NGO ID is missing. Cannot view NGO details.');
      return;
    }
    
    navigate(`/ngo/details?id=${ngoId}`);
  };

  const handleDelete = (ngo: NGORecord) => {
    const ngoId = ngo._id || ngo.id;
    if (!ngoId) {
      window.alert('NGO ID is missing. Cannot delete NGO.');
      return;
    }
    
    setDeleteTargetId(ngoId);
    setDeleteTargetName(ngo.name || 'NGO');
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    try {
      setDeleting(true);
      const deleteEndpoint = `/ngo-main/delete-ngo-main/${deleteTargetId}`;
      await api.delete(deleteEndpoint);
      
      // Remove the record from local state immediately
      setNgos((prev) => prev.filter((item) => (item._id || item.id) !== deleteTargetId));
      
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      setDeleteTargetName(null);
      
      // Refresh the list to ensure we have the latest data from the server
      await fetchNGOs();
    } catch (err: any) {
      console.error('Error deleting NGO:', err);
      window.alert(err?.response?.data?.message || err?.message || 'Failed to delete NGO. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (data: NGOFormState) => {
    try {
      setSubmitting(true);
      
      const payload = {
        name: data.name,
        field_of_work: data.field_of_work,
        operating_area_district_id: data.operating_area_district_id || null,
        funding_source: data.funding_source,
        known_affiliate_linkage: data.known_affiliate_linkage || '',
        ngo_category: data.ngo_category || '',
        ngo_risk_level: data.ngo_risk_level || '',
        is_involve_financial_irregularities: data.is_involve_financial_irregularities,
        is_against_national_interest: data.is_against_national_interest,
        nature_of_anti_national_activity: data.is_against_national_interest 
          ? (data.nature_of_anti_national_activity || '') 
          : '',
        remarks: data.remarks || '',
      };
      
      console.log('Submitting payload:', payload);

      if (editingId) {
        const updateEndpoint = `/ngo-main/update-ngo-main/${editingId}`;
        const updateResponse = await api.put(updateEndpoint, payload);
        const updatedData = updateResponse.data?.data || updateResponse.data;
        
        // Update local state with the updated record
        if (updatedData) {
          setNgos((prev) =>
            prev.map((item) =>
              (item._id || item.id) === editingId
                ? {
                    _id: updatedData._id || updatedData.id || editingId,
                    id: updatedData._id || updatedData.id || editingId,
                    name: updatedData.name || payload.name,
                    field_of_work: updatedData.field_of_work || payload.field_of_work,
                    operating_area_district_id: updatedData.operating_area_district_id ?? payload.operating_area_district_id,
                    operating_area_district_name: updatedData.operating_area_district_name || 
                      districts.find(d => d._id === (updatedData.operating_area_district_id ?? payload.operating_area_district_id))?.name,
                    funding_source: updatedData.funding_source || payload.funding_source,
                    known_affiliate_linkage: updatedData.known_affiliate_linkage || payload.known_affiliate_linkage,
                    ngo_category: updatedData.ngo_category || payload.ngo_category || '',
                    ngo_risk_level: updatedData.ngo_risk_level || payload.ngo_risk_level || '',
                    is_involve_financial_irregularities: updatedData.is_involve_financial_irregularities ?? payload.is_involve_financial_irregularities,
                    is_against_national_interest: updatedData.is_against_national_interest ?? payload.is_against_national_interest,
                    nature_of_anti_national_activity: updatedData.nature_of_anti_national_activity || payload.nature_of_anti_national_activity || '',
                    remarks: updatedData.remarks || payload.remarks,
                  } as NGORecord
                : item
            )
          );
        }
      } else {
        const addEndpoint = `/ngo-main/add-ngo-main`;
        const addResponse = await api.post(addEndpoint, payload);
        
        console.log('Add response:', addResponse.data);
        
        // Handle different response structures
        let newNGOData: any = null;
        if (addResponse.data?.data) {
          newNGOData = addResponse.data.data;
        } else if (addResponse.data && typeof addResponse.data === 'object' && !addResponse.data.success) {
          newNGOData = addResponse.data;
        }
        
        console.log('Extracted newNGOData:', newNGOData);
        
        // If we got the data from response, use it; otherwise construct from payload
        if (newNGOData) {
          const districtId = newNGOData.operating_area_district_id ?? payload.operating_area_district_id;
          const districtName = newNGOData.operating_area_district_name || 
            districts.find(d => d._id === districtId)?.name;
          
          const newNGO: NGORecord = {
            _id: newNGOData._id || newNGOData.id || `temp-${Date.now()}`,
            id: newNGOData._id || newNGOData.id || `temp-${Date.now()}`,
            name: newNGOData.name || payload.name,
            field_of_work: newNGOData.field_of_work || payload.field_of_work,
            operating_area_district_id: districtId,
            operating_area_district_name: districtName,
            funding_source: newNGOData.funding_source || payload.funding_source,
            known_affiliate_linkage: newNGOData.known_affiliate_linkage || payload.known_affiliate_linkage,
            ngo_category: newNGOData.ngo_category || payload.ngo_category || '',
            ngo_risk_level: newNGOData.ngo_risk_level || payload.ngo_risk_level || '',
            is_involve_financial_irregularities: newNGOData.is_involve_financial_irregularities ?? payload.is_involve_financial_irregularities,
            is_against_national_interest: newNGOData.is_against_national_interest ?? payload.is_against_national_interest,
            nature_of_anti_national_activity: newNGOData.nature_of_anti_national_activity || payload.nature_of_anti_national_activity || '',
            remarks: newNGOData.remarks || payload.remarks,
          };
          console.log('Adding new NGO to state:', newNGO);
          setNgos((prev) => {
            const updated = [...prev, newNGO];
            console.log('Updated NGOs state:', updated);
            return updated;
          });
        } else {
          // Fallback: create entry from payload if response doesn't have data
          console.log('No data in response, creating from payload');
          const newNGO: NGORecord = {
            _id: `temp-${Date.now()}`,
            id: `temp-${Date.now()}`,
            ...payload,
          };
          console.log('Adding new NGO from payload:', newNGO);
          setNgos((prev) => {
            const updated = [...prev, newNGO];
            console.log('Updated NGOs state:', updated);
            return updated;
          });
        }
      }
      
      setShowModal(false);
      setEditingId(null);
      setFormData(buildInitialForm());
      
      // Refresh the list to ensure we have the latest data from the server
      await fetchNGOs();
    } catch (err: any) {
      console.error('Error submitting NGO:', err);
      window.alert(err?.response?.data?.message || err?.message || 'Failed to save NGO. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedNGOs = useMemo(() => {
    let filtered = ngos;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = ngos.filter((ngo) => {
        return (
          (ngo.name || '').toLowerCase().includes(searchLower) ||
          (ngo.field_of_work || '').toLowerCase().includes(searchLower) ||
          (ngo.funding_source || '').toLowerCase().includes(searchLower) ||
          (ngo.known_affiliate_linkage || '').toLowerCase().includes(searchLower) ||
          (ngo.ngo_category || '').toLowerCase().includes(searchLower) ||
          (ngo.ngo_risk_level || '').toLowerCase().includes(searchLower) ||
          (ngo.remarks || '').toLowerCase().includes(searchLower)
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
            aValue = (a.name || '').toLowerCase();
            bValue = (b.name || '').toLowerCase();
            break;
          case 'field_of_work':
            aValue = (a.field_of_work || '').toLowerCase();
            bValue = (b.field_of_work || '').toLowerCase();
            break;
          case 'operating_area_district_id':
            aValue = (a.operating_area_district_id || '').toLowerCase();
            bValue = (b.operating_area_district_id || '').toLowerCase();
            break;
          case 'funding_source':
            aValue = (a.funding_source || '').toLowerCase();
            bValue = (b.funding_source || '').toLowerCase();
            break;
          case 'known_affiliate_linkage':
            aValue = (a.known_affiliate_linkage || '').toLowerCase();
            bValue = (b.known_affiliate_linkage || '').toLowerCase();
            break;
          case 'ngo_category':
            aValue = (a.ngo_category || '').toLowerCase();
            bValue = (b.ngo_category || '').toLowerCase();
            break;
          case 'ngo_risk_level':
            aValue = (a.ngo_risk_level || '').toLowerCase();
            bValue = (b.ngo_risk_level || '').toLowerCase();
            break;
          case 'is_involve_financial_irregularities':
            aValue = a.is_involve_financial_irregularities ? 1 : 0;
            bValue = b.is_involve_financial_irregularities ? 1 : 0;
            break;
          case 'is_against_national_interest':
            aValue = a.is_against_national_interest ? 1 : 0;
            bValue = b.is_against_national_interest ? 1 : 0;
            break;
          case 'remarks':
            aValue = (a.remarks || '').toLowerCase();
            bValue = (b.remarks || '').toLowerCase();
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
  }, [ngos, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedNGOs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedNGOs.slice(startIndex, endIndex);
  }, [filteredAndSortedNGOs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedNGOs.length / itemsPerPage);

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>NGOs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading NGOs...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>NGOs</CardTitle>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add NGO
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search NGOs..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>

          <div className="w-full">
            <Table className="w-full">
              <colgroup>
                <col className="w-[11%]" />
                <col className="w-[9%]" />
                <col className="w-[11%]" />
                <col className="w-[9%]" />
                <col className="w-[11%]" />
                <col className="w-[9%]" />
                <col className="w-[9%]" />
                <col className="w-[8%]" />
                <col className="w-[8%]" />
                <col className="w-[8%]" />
                <col className="w-[7%]" />
              </colgroup>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center hover:text-foreground transition-colors w-full text-left"
                    >
                      Name {getSortIcon('name')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('field_of_work')}
                      className="flex items-center hover:text-foreground transition-colors w-full text-left"
                    >
                      Field of Work {getSortIcon('field_of_work')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('operating_area_district_id')}
                      className="flex items-center hover:text-foreground transition-colors w-full text-left"
                    >
                      Operating Area District {getSortIcon('operating_area_district_id')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('funding_source')}
                      className="flex items-center hover:text-foreground transition-colors w-full text-left"
                    >
                      Funding Source {getSortIcon('funding_source')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('known_affiliate_linkage')}
                      className="flex items-center hover:text-foreground transition-colors w-full text-left"
                    >
                      Known Affiliate Linkage {getSortIcon('known_affiliate_linkage')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('ngo_category')}
                      className="flex items-center hover:text-foreground transition-colors w-full text-left"
                    >
                      NGO Category {getSortIcon('ngo_category')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('ngo_risk_level')}
                      className="flex items-center hover:text-foreground transition-colors w-full text-left"
                    >
                      NGO Risk Level {getSortIcon('ngo_risk_level')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('is_involve_financial_irregularities')}
                      className="flex items-center hover:text-foreground transition-colors w-full text-left"
                    >
                      Financial Irregularities {getSortIcon('is_involve_financial_irregularities')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('is_against_national_interest')}
                      className="flex items-center hover:text-foreground transition-colors w-full text-left"
                    >
                      Against National Interest {getSortIcon('is_against_national_interest')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('remarks')}
                      className="flex items-center hover:text-foreground transition-colors w-full text-left"
                    >
                      Remarks {getSortIcon('remarks')}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedNGOs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No NGOs found matching your search.' : 'No NGOs found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedNGOs.map((ngo) => (
                    <TableRow key={ngo._id || ngo.id}>
                      <TableCell className="font-medium truncate" title={ngo.name || 'N/A'}>
                        {ngo.name || 'N/A'}
                      </TableCell>
                      <TableCell className="truncate" title={ngo.field_of_work || 'N/A'}>
                        {ngo.field_of_work || 'N/A'}
                      </TableCell>
                      <TableCell className="truncate" title={ngo.operating_area_district_name || ngo.operating_area_district_id || 'N/A'}>
                        {ngo.operating_area_district_name || ngo.operating_area_district_id || 'N/A'}
                      </TableCell>
                      <TableCell className="truncate" title={ngo.funding_source || 'N/A'}>
                        {ngo.funding_source || 'N/A'}
                      </TableCell>
                      <TableCell className="truncate" title={ngo.known_affiliate_linkage || 'N/A'}>
                        {ngo.known_affiliate_linkage || 'N/A'}
                      </TableCell>
                      <TableCell className="truncate" title={ngo.ngo_category || 'N/A'}>
                        {ngo.ngo_category || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          ngo.ngo_risk_level === 'high' 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            : ngo.ngo_risk_level === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                            : ngo.ngo_risk_level === 'low'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                        }`}>
                          {ngo.ngo_risk_level ? ngo.ngo_risk_level.charAt(0).toUpperCase() + ngo.ngo_risk_level.slice(1) : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {ngo.is_involve_financial_irregularities ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {ngo.is_against_national_interest ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell className="truncate" title={ngo.remarks || 'N/A'}>
                        {ngo.remarks || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(ngo)}
                            className="h-8 w-8 p-0"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(ngo)}
                            className="h-8 w-8 p-0"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(ngo)}
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
          {filteredAndSortedNGOs.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedNGOs.length)} of {filteredAndSortedNGOs.length} entries
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
      <NGOFormModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setEditingId(null);
            setFormData(buildInitialForm());
          }
        }}
        onSubmit={handleSubmit}
        initialData={editingId ? formData : null}
        isEditMode={!!editingId}
        loading={loadingRecord}
        submitting={submitting}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onSubmit={handleDeleteConfirm}
        id={deleteTargetId}
        message={`Are you sure you want to delete this NGO: ${deleteTargetName}? This action cannot be undone.`}
        deleting={deleting}
        title="Delete NGO"
      />
    </div>
  );
};

export default NGOList;

