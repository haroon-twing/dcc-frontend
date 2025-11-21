import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI/tabs';
import { ArrowLeft, Calendar, Camera, Users, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { publicApi } from '../lib/api';
import { fetchLookups, fetchCities, type ProvinceOption, type DistrictOption, type CityOption } from '../lib/lookups';
import Integration from '../components/safecity/Integration';
import MeasuresTaken from '../components/safecity/MeasuresTaken';
import ThreatAlerts from '../components/safecity/ThreatAlerts';
import PoliceStationConnectivity from '../components/safecity/PoliceStationConnectivity';

const statusColors: Record<string, string> = {
  'in progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  'pending': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  'Pending': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  'In Progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
};

interface SafeCityData {
  province: string;
  district: string;
  city: string;
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
}

const SafeCityDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const safeCityId = searchParams.get('id');
  
  const [safeCityData, setSafeCityData] = useState<SafeCityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);

  useEffect(() => {
    const fetchSafeCityDetails = async () => {
      if (!safeCityId) {
        setError('No Safe City ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch lookups first (provinces, districts, cities)
        const [lookupsResult, citiesList] = await Promise.all([
          fetchLookups(),
          fetchCities(),
        ]);
        
        setProvinces(lookupsResult.provinces || []);
        setDistricts(lookupsResult.districts || []);
        setCities(citiesList || []);
        
        // TODO: Replace with actual API endpoint when available
        // const endpoint = `/safecity/get-single-safecitymain/${safeCityId}`;
        // const response = await publicApi.get(endpoint);
        
        // For now, fetch from the list and find the matching record
        const response = await publicApi.get('/safecity/get-safecitymains');
        const records = response.data?.data || response.data || [];
        const record = records.find((item: any) => (item._id || item.id) === safeCityId);
        
        if (record) {
          // Get the province, district, and city IDs from the response
          const provinceId = record.province_id?._id || record.province_id || '';
          const districtId = record.district_id?._id || record.district_id || '';
          const cityId = record.city_id?._id || record.city_id || '';
          
          // Find the names from the loaded lookups
          const province = lookupsResult.provinces?.find(p => p._id === provinceId);
          const district = lookupsResult.districts?.find(d => d._id === districtId);
          const city = citiesList?.find(c => c._id === cityId);
          
          setSafeCityData({
            province: province?.name || record.province_id?.name || '-',
            district: district?.name || record.district_id?.name || '-',
            city: city?.name || record.city_id?.name || record.city_id || '-',
            approval_date: record.approval_date || '',
            present_status: record.present_status || '',
            per_present_status: record.per_present_status,
            no_of_total_cameras: record.no_of_total_cameras || 0,
            active_cameras: record.active_cameras || 0,
            inactive_cameras: record.inactive_cameras || 0,
            fr_cameras: record.fr_cameras || 0,
            non_fr_cameras: record.non_fr_cameras || 0,
            no_of_employees: record.no_of_employees || 0,
            remarks: record.remarks || 'No remarks available.',
          });
        } else {
          setError('Safe City record not found');
        }
      } catch (err: any) {
        console.error('Error fetching safe city details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load safe city details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSafeCityDetails();
  }, [safeCityId]);

  const formatStatus = (status: string) => {
    if (!status) return 'Active';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading safe city details...</p>
        </div>
      </div>
    );
  }

  if (error || !safeCityData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/safe-city/list')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold text-foreground">Error Loading Details</p>
              <p className="text-muted-foreground">{error || 'Safe City not found'}</p>
              <Button onClick={() => navigate('/safe-city/list')} variant="secondary">
                Return to List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/safe-city/list')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Safe City Details</h2>
          <p className="text-muted-foreground">
            Detailed information about the Safe City surveillance project
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
            statusColors[safeCityData.present_status] || 'bg-muted text-foreground'
          }`}>
            {formatStatus(safeCityData.present_status)}
          </span>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Province</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{safeCityData.province}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">District</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{safeCityData.district}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">City</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{safeCityData.city}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cameras</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{safeCityData.no_of_total_cameras}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{safeCityData.no_of_employees}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Core details about the Safe City project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Approval Date</p>
              <p className="text-base text-foreground font-medium">{formatDate(safeCityData.approval_date)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Present Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[safeCityData.present_status] || 'bg-muted text-foreground'
              }`}>
                {formatStatus(safeCityData.present_status)}
              </span>
            </div>
            {safeCityData.present_status === 'in progress' && safeCityData.per_present_status !== undefined && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Progress Percentage</p>
                <p className="text-base text-foreground font-medium">{safeCityData.per_present_status}%</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Cameras</p>
              <p className="text-base text-foreground font-medium">{safeCityData.no_of_total_cameras}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Number of Employees</p>
              <p className="text-base text-foreground font-medium">{safeCityData.no_of_employees}</p>
            </div>
          </CardContent>
        </Card>

        {/* Camera Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera Statistics
            </CardTitle>
            <CardDescription>Surveillance camera details and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Active Cameras</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <p className="text-base text-foreground font-medium">{safeCityData.active_cameras}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Inactive Cameras</p>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <p className="text-base text-foreground font-medium">{safeCityData.inactive_cameras}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">FR Cameras</p>
              <p className="text-base text-foreground font-medium">{safeCityData.fr_cameras}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Non-FR Cameras</p>
              <p className="text-base text-foreground font-medium">{safeCityData.non_fr_cameras}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="integration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="measures-taken">Measures Taken</TabsTrigger>
          <TabsTrigger value="threat-alerts">Threat Alerts</TabsTrigger>
          <TabsTrigger value="police-station-connectivity">Police Station Connectivity</TabsTrigger>
        </TabsList>
        <TabsContent value="integration" className="mt-4">
          <Integration safeCityId={safeCityId || ''} />
        </TabsContent>
        <TabsContent value="measures-taken" className="mt-4">
          <MeasuresTaken safeCityId={safeCityId || ''} />
        </TabsContent>
        <TabsContent value="threat-alerts" className="mt-4">
          <ThreatAlerts safeCityId={safeCityId || ''} />
        </TabsContent>
        <TabsContent value="police-station-connectivity" className="mt-4">
          <PoliceStationConnectivity safeCityId={safeCityId || ''} />
        </TabsContent>
      </Tabs>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Additional Information
          </CardTitle>
          <CardDescription>Remarks and additional notes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Remarks</p>
            <p className="text-base text-foreground whitespace-pre-wrap">
              {safeCityData.remarks}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafeCityDetails;

