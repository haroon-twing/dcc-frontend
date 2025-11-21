import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, Loader2, Smartphone, Percent, AlertCircle } from 'lucide-react';
import { publicApi } from '../lib/api';

interface PrevalenceOfOutOfZoneSimsData {
  _id?: string;
  id?: string;
  distid: number;
  per_population_using_sims: number;
  per_outzone_sims_used_total: number;
  per_afghan_sims_used_from_outzone_sims: number;
  remarks: string;
}

const PrevalenceOfOutOfZoneSimsDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id: recordId } = useParams<{ id: string }>();
  
  const [recordData, setRecordData] = useState<PrevalenceOfOutOfZoneSimsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Record ID from URL params:', recordId); // Debug log
    
    const fetchRecordDetails = async () => {
      if (!recordId) {
        console.error('No record ID provided in URL');
        setError('No record ID provided in URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching record with ID:', recordId); // Debug log
        const endpoint = `/ispec-illegal-sims-prevalance-outzone-sims/get-single-ispec-illegal-sims-prevalance-outzone-sim/${recordId}`;
        console.log('API Endpoint:', endpoint); // Debug log
        const response = await publicApi.get(endpoint);
        
        const data = response.data?.data || response.data;
        
        if (data) {
          setRecordData({
            _id: data._id || data.id,
            id: data._id || data.id,
            distid: data.distid || 0,
            per_population_using_sims: data.per_population_using_sims || 0,
            per_outzone_sims_used_total: data.per_outzone_sims_used_total || 0,
            per_afghan_sims_used_from_outzone_sims: data.per_afghan_sims_used_from_outzone_sims || 0,
            remarks: data.remarks || ''
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching record details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load record details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecordDetails();
  }, [recordId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading record details...</p>
        </div>
      </div>
    );
  }

  if (error || !recordData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/illegal-spectrum/illegal-sims')}
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
              <p className="text-muted-foreground">{error || 'Record not found'}</p>
              <Button onClick={() => navigate('/illegal-spectrum/illegal-sims')} variant="secondary">
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
              onClick={() => navigate('/illegal-spectrum/illegal-sims')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Prevalence of Out of Zone SIMs</h2>
          <p className="text-muted-foreground">
            Detailed information about out of zone SIMs prevalence
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Population Using SIMs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {recordData.per_population_using_sims.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Out Zone SIMs Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {recordData.per_outzone_sims_used_total.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Afghan SIMs from Out Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {recordData.per_afghan_sims_used_from_outzone_sims.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Information Grid */}
      <div className="grid gap-6">
        {/* District Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              District Information
            </CardTitle>
            <CardDescription>Details about the district and SIM usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">District ID</p>
                <p className="text-foreground">{recordData.distid}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Population Using SIMs</p>
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{recordData.per_population_using_sims.toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Out Zone SIMs Used (Total)</p>
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{recordData.per_outzone_sims_used_total.toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Afghan SIMs from Out Zone</p>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{recordData.per_afghan_sims_used_from_outzone_sims.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            {recordData.remarks && (
              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Remarks</p>
                <p className="text-foreground whitespace-pre-line">{recordData.remarks}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrevalenceOfOutOfZoneSimsDetails;
