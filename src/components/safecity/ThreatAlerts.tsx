import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { AlertTriangle, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import ThreatAlertsFormModal from '../modals/safecity/ThreatAlertsFormModal';
import DeleteModal from '../UI/DeleteModal';

interface ThreatAlert {
  _id?: string;
  id?: string;
  no_of_ta_issued: number;
  no_of_actions_taken: number;
  remarks?: string;
  sc_id: string;
}

interface ThreatAlertsFormState {
  no_of_ta_issued: number;
  no_of_actions_taken: number;
  remarks: string;
}

interface ThreatAlertsProps {
  safeCityId: string;
}

const ThreatAlerts: React.FC<ThreatAlertsProps> = ({ safeCityId }) => {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingAlert, setEditingAlert] = useState<ThreatAlert | null>(null);
  const [viewingAlert, setViewingAlert] = useState<ThreatAlert | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [loadingAlert, setLoadingAlert] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [alertToDeleteId, setAlertToDeleteId] = useState<string | number | undefined>(undefined);
  const [alertToDeleteName, setAlertToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const buildInitialForm = (): ThreatAlertsFormState => ({
    no_of_ta_issued: 0,
    no_of_actions_taken: 0,
    remarks: '',
  });

  const [formData, setFormData] = useState<ThreatAlertsFormState>(buildInitialForm());

  const fetchAlerts = async () => {
    if (!safeCityId) {
      setLoading(false);
      setAlerts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/safecity/get-safecitythreatalerts/${safeCityId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      console.log('Fetched threat alerts data:', data);
      
      const alertsData: ThreatAlert[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        no_of_ta_issued: item.no_of_ta_issued ?? 0,
        no_of_actions_taken: item.no_of_actions_taken ?? 0,
        remarks: item.remarks || '',
        sc_id: item.sc_id || safeCityId,
      }));
      
      setAlerts(alertsData);
    } catch (err: any) {
      console.error('Error fetching threat alerts:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load threat alerts. Please try again.'
      );
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [safeCityId]);

  // Debug: Log alerts state changes
  useEffect(() => {
    console.log('Alerts state updated:', alerts);
  }, [alerts]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingAlert(null);
    setViewingAlert(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleEdit = async (threatAlert: ThreatAlert) => {
    const alertId = threatAlert._id || threatAlert.id;
    if (!alertId) {
      window.alert('Alert ID is missing. Cannot load alert details.');
      return;
    }

    setLoadingAlert(true);
    setViewingAlert(null);
    setEditingAlert(threatAlert);
    setIsViewMode(false);
    
    try {
      // TODO: Replace with actual API endpoint when available
      // const editEndpoint = `/safecity/get-single-threat-alert/${alertId}`;
      // const response = await publicApi.get(editEndpoint);
      // const alertData = response.data?.data || response.data;
      
      // For now, use the alert data directly
      const alertData = threatAlert;
      
      setFormData({
        no_of_ta_issued: alertData.no_of_ta_issued ?? 0,
        no_of_actions_taken: alertData.no_of_actions_taken ?? 0,
        remarks: alertData.remarks || '',
      });
      
      setShowModal(true);
    } catch (err: any) {
      console.error('Error loading alert for edit:', err);
      window.alert('Failed to load alert data. Please try again.');
    } finally {
      setLoadingAlert(false);
    }
  };

  const handleView = async (threatAlert: ThreatAlert) => {
    const alertId = threatAlert._id || threatAlert.id;
    if (!alertId) {
      window.alert('Alert ID is missing. Cannot load alert details.');
      return;
    }

    setLoadingAlert(true);
    setEditingAlert(null);
    setViewingAlert(threatAlert);
    setIsViewMode(true);
    
    try {
      const viewEndpoint = `/safecity/get-single-safecitythreatalert/${alertId}`;
      const response = await publicApi.get(viewEndpoint);
      const alertData = response.data?.data || response.data;
      
      console.log('Fetched threat alert for view:', alertData);
      
      if (alertData) {
        setFormData({
          no_of_ta_issued: alertData.no_of_ta_issued ?? 0,
          no_of_actions_taken: alertData.no_of_actions_taken ?? 0,
          remarks: alertData.remarks || '',
        });
      } else {
        // Fallback to table data if API doesn't return data
        setFormData({
          no_of_ta_issued: threatAlert.no_of_ta_issued ?? 0,
          no_of_actions_taken: threatAlert.no_of_actions_taken ?? 0,
          remarks: threatAlert.remarks || '',
        });
      }
      
      setShowModal(true);
    } catch (err: any) {
      console.error('Error loading alert for view:', err);
      window.alert(err?.response?.data?.message || err?.message || 'Failed to load alert data. Please try again.');
      // Fallback to table data on error
      setFormData({
        no_of_ta_issued: threatAlert.no_of_ta_issued ?? 0,
        no_of_actions_taken: threatAlert.no_of_actions_taken ?? 0,
        remarks: threatAlert.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingAlert(false);
    }
  };

  const handleDelete = (threatAlert: ThreatAlert) => {
    const alertId = threatAlert._id || threatAlert.id;
    if (!alertId) {
      window.alert('Alert ID is missing. Cannot delete alert.');
      return;
    }
    
    setAlertToDeleteId(alertId);
    setAlertToDeleteName(`Threat Alert (TA Issued: ${threatAlert.no_of_ta_issued}, Actions: ${threatAlert.no_of_actions_taken})`);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (id: string | number) => {
    if (!id) return;

    try {
      setDeleting(true);
      const deleteEndpoint = `/safecity/delete-safecitythreatalert/${id}`;
      await api.delete(deleteEndpoint);
      
      // Remove the record from local state immediately
      setAlerts((prev) => prev.filter((item) => (item._id || item.id) !== id));
      
      setShowDeleteModal(false);
      setAlertToDeleteId(undefined);
      setAlertToDeleteName('');
      
      // Refresh the list to ensure we have the latest data from the server
      await fetchAlerts();
    } catch (err: any) {
      console.error('Error deleting alert:', err);
      window.alert(err?.response?.data?.message || err?.message || 'Failed to delete alert. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (data: ThreatAlertsFormState) => {
    try {
      setSubmitting(true);
      
      const payload = {
        no_of_ta_issued: data.no_of_ta_issued,
        no_of_actions_taken: data.no_of_actions_taken,
        sc_id: safeCityId,
        remarks: data.remarks || '',
      };

      if (editingAlert) {
        const alertId = editingAlert._id || editingAlert.id;
        if (!alertId) {
          window.alert('Alert ID is missing. Cannot update alert.');
          return;
        }
        
        const updateEndpoint = `/safecity/update-safecitythreatalert/${alertId}`;
        const updateResponse = await api.put(updateEndpoint, payload);
        const updatedData = updateResponse.data?.data || updateResponse.data;
        
        // Update local state with the updated record
        if (updatedData) {
          setAlerts((prev) =>
            prev.map((item) =>
              (item._id || item.id) === alertId
                ? {
                    _id: updatedData._id || updatedData.id || alertId,
                    id: updatedData._id || updatedData.id || alertId,
                    no_of_ta_issued: updatedData.no_of_ta_issued ?? 0,
                    no_of_actions_taken: updatedData.no_of_actions_taken ?? 0,
                    remarks: updatedData.remarks || '',
                    sc_id: updatedData.sc_id || safeCityId,
                  }
                : item
            )
          );
        }
      } else {
        const addEndpoint = `/safecity/add-safecitythreatalert`;
        const addResponse = await api.post(addEndpoint, payload);
        
        console.log('Add response:', addResponse.data);
        
        // Handle different response structures
        // Response structure: {success: true, message: "...", data: {...}}
        let newAlertData = null;
        if (addResponse.data?.data) {
          newAlertData = addResponse.data.data;
        } else if (addResponse.data && typeof addResponse.data === 'object' && !addResponse.data.success) {
          // If response.data is the actual data object (not wrapped)
          newAlertData = addResponse.data;
        }
        
        console.log('Extracted newAlertData:', newAlertData);
        
        // If we got the data from response, use it; otherwise construct from payload
        if (newAlertData) {
          const newAlert: ThreatAlert = {
            _id: newAlertData._id || newAlertData.id || `temp-${Date.now()}`,
            id: newAlertData._id || newAlertData.id || `temp-${Date.now()}`,
            no_of_ta_issued: newAlertData.no_of_ta_issued ?? payload.no_of_ta_issued ?? 0,
            no_of_actions_taken: newAlertData.no_of_actions_taken ?? payload.no_of_actions_taken ?? 0,
            remarks: newAlertData.remarks || payload.remarks || '',
            sc_id: newAlertData.sc_id || payload.sc_id || safeCityId,
          };
          console.log('Adding new alert to state:', newAlert);
          setAlerts((prev) => {
            const updated = [...prev, newAlert];
            console.log('Updated alerts state:', updated);
            return updated;
          });
        } else {
          // Fallback: create entry from payload if response doesn't have data
          console.log('No data in response, creating from payload');
          const newAlert: ThreatAlert = {
            _id: `temp-${Date.now()}`,
            id: `temp-${Date.now()}`,
            no_of_ta_issued: payload.no_of_ta_issued ?? 0,
            no_of_actions_taken: payload.no_of_actions_taken ?? 0,
            remarks: payload.remarks || '',
            sc_id: payload.sc_id || safeCityId,
          };
          console.log('Adding new alert from payload:', newAlert);
          setAlerts((prev) => {
            const updated = [...prev, newAlert];
            console.log('Updated alerts state:', updated);
            return updated;
          });
        }
      }
      
      setShowModal(false);
      setEditingAlert(null);
      setViewingAlert(null);
      setIsViewMode(false);
      setFormData(buildInitialForm());
      
      // Refresh the list to ensure we have the latest data from the server
      await fetchAlerts();
    } catch (err: any) {
      console.error('Error submitting alert:', err);
      window.alert(err?.response?.data?.message || err?.message || 'Failed to save alert. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedAlerts = useMemo(() => {
    let filtered = alerts;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = alerts.filter((threatAlert) => {
        return (
          String(threatAlert.no_of_ta_issued || 0).includes(searchLower) ||
          String(threatAlert.no_of_actions_taken || 0).includes(searchLower) ||
          (threatAlert.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'no_of_ta_issued':
            aValue = a.no_of_ta_issued || 0;
            bValue = b.no_of_ta_issued || 0;
            break;
          case 'no_of_actions_taken':
            aValue = a.no_of_actions_taken || 0;
            bValue = b.no_of_actions_taken || 0;
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
  }, [alerts, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedAlerts.slice(startIndex, endIndex);
  }, [filteredAndSortedAlerts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedAlerts.length / itemsPerPage);

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Threat Alerts
          </CardTitle>
          <CardDescription>Security threat alerts for this Safe City project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading threat alerts...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Threat Alerts
          </CardTitle>
          <CardDescription>Security threat alerts for this Safe City project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600 dark:text-red-400">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Threat Alerts
              </CardTitle>
              <CardDescription>Security threat alerts for this Safe City project</CardDescription>
            </div>
            <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Threat Alerts
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search threat alerts..."
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
                    onClick={() => handleSort('no_of_ta_issued')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Number of TA Issued {getSortIcon('no_of_ta_issued')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('no_of_actions_taken')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Number of Actions Taken {getSortIcon('no_of_actions_taken')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('remarks')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Remarks {getSortIcon('remarks')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No threat alerts found matching your search.' : 'No threat alerts found for this Safe City project.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAlerts.map((threatAlert) => (
                  <TableRow key={threatAlert._id || threatAlert.id}>
                    <TableCell className="font-medium">{threatAlert.no_of_ta_issued || 0}</TableCell>
                    <TableCell>{threatAlert.no_of_actions_taken || 0}</TableCell>
                    <TableCell className="max-w-xs truncate" title={threatAlert.remarks}>
                      {threatAlert.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(threatAlert)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(threatAlert)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(threatAlert)}
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
        {filteredAndSortedAlerts.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedAlerts.length)} of {filteredAndSortedAlerts.length} entries
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

      {/* Form Modal */}
      <ThreatAlertsFormModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setEditingAlert(null);
            setViewingAlert(null);
            setIsViewMode(false);
            setFormData(buildInitialForm());
          }
        }}
        onSubmit={handleSubmit}
        initialData={isViewMode ? formData : editingAlert ? formData : null}
        isEditMode={!!editingAlert && !isViewMode}
        isViewMode={isViewMode}
        loading={loadingAlert}
        submitting={submitting}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onSubmit={handleDeleteConfirm}
        id={alertToDeleteId}
        message={`Are you sure you want to delete this threat alert: ${alertToDeleteName}? This action cannot be undone.`}
        deleting={deleting}
        title="Delete Threat Alerts"
      />
    </Card>
  );
};

export default ThreatAlerts;

