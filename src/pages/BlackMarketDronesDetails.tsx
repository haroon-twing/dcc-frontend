import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, CheckCircle, XCircle, Loader2, Activity, Database, Shield } from 'lucide-react';
import { publicApi } from '../lib/api';

interface BlackMarketDronesData {
  is_identification_of_agencies: boolean;
  is_db_vendor_formed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const BlackMarketDronesDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');
  
  const [blackMarketData, setBlackMarketData] = useState<BlackMarketDronesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlackMarketDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await publicApi.get(`/ispec-blackmarket-drone-nvd/get-single-ispec-blackmarket-drone-nvd/${recordId}`);
        
        const data = response.data?.data || response.data;
        
        if (data) {
          setBlackMarketData({
            is_identification_of_agencies: Boolean(data.is_identification_of_agencies),
            is_db_vendor_formed: Boolean(data.is_db_vendor_formed),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching black market drones details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load black market drones details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlackMarketDetails();
  }, [recordId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading black market drones details...</p>
        </div>
      </div>
    );
  }

  if (error || !blackMarketData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/illegal-spectrum/black-market-drones')}
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
              <p className="text-muted-foreground">{error || 'Black Market Drones record not found'}</p>
              <Button onClick={() => navigate('/illegal-spectrum/black-market-drones')} variant="secondary">
                Return to List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/illegal-spectrum/black-market-drones')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Black Market Drones Overview</h2>
          <p className="text-muted-foreground">
            Detailed information about black market drones and vendors
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Agency Identification
            </CardTitle>
            <CardDescription>Status of agency identification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {blackMarketData.is_identification_of_agencies ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-lg font-semibold text-foreground">Identified</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-lg font-semibold text-foreground">Not Identified</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Status
            </CardTitle>
            <CardDescription>Vendor database formation status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {blackMarketData.is_db_vendor_formed ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-lg font-semibold text-foreground">Database Formed</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-lg font-semibold text-foreground">Database Not Formed</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Record Information
          </CardTitle>
          <CardDescription>Metadata about this record</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-foreground">{formatDate(blackMarketData.createdAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-foreground">{formatDate(blackMarketData.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlackMarketDronesDetails;
