import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { publicApi } from '../lib/api';

interface HawalaHundiData {
  id: string;
  is_db_dealer_formed: boolean;
  no_dealers_convicted: number;
  no_dealers_freebycourt: number;
  no_delaers_cases_pending: number;
  is_mthly_review_prep: boolean;
  per_change_inflow: number;
  is_active: boolean;
}

const HawalaHundiDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');
  
  const [hawalaHundiData, setHawalaHundiData] = useState<HawalaHundiData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHawalaHundiDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await publicApi.get(`/ispec-hawala-hundi/get-single-ispec-hawala-hundi/${recordId}`);
        const data = response.data?.data || response.data;
        
        if (data) {
          setHawalaHundiData({
            id: data._id || data.id,
            is_db_dealer_formed: data.is_db_dealer_formed || false,
            no_dealers_convicted: data.no_dealers_convicted || 0,
            no_dealers_freebycourt: data.no_dealers_freebycourt || 0,
            no_delaers_cases_pending: data.no_delaers_cases_pending || 0,
            is_mthly_review_prep: data.is_mthly_review_prep || false,
            per_change_inflow: data.per_change_inflow || 0,
            is_active: data.is_active !== undefined ? data.is_active : true,
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching hawala hundi details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load hawala/hundi details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHawalaHundiDetails();
  }, [recordId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading hawala/hundi details...</p>
        </div>
      </div>
    );
  }

  if (error || !hawalaHundiData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/illegal-spectrum/hawala-hundi')}
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
              <p className="text-muted-foreground">{error || 'Hawala/Hundi record not found'}</p>
              <Button onClick={() => navigate('/hawala-hundi')} variant="secondary">
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
              onClick={() => navigate('/illegal-spectrum/hawala-hundi')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Hawala/Hundi Record Details</h2>
          <p className="text-muted-foreground">
            Detailed information about Hawala/Hundi record
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Hawala/Hundi record information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">DB Dealer Formed</p>
                <div className="flex items-center">
                  {hawalaHundiData.is_db_dealer_formed ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span>{hawalaHundiData.is_db_dealer_formed ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Monthly Review Prepared</p>
                <div className="flex items-center">
                  {hawalaHundiData.is_mthly_review_prep ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span>{hawalaHundiData.is_mthly_review_prep ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Dealers Convicted</p>
                <p className="text-foreground">{hawalaHundiData.no_dealers_convicted}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Dealers Freed by Court</p>
                <p className="text-foreground">{hawalaHundiData.no_dealers_freebycourt}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Cases Pending</p>
                <p className="text-foreground">{hawalaHundiData.no_delaers_cases_pending}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">% Change Inflow</p>
                <p className="text-foreground">{hawalaHundiData.per_change_inflow.toFixed(2)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HawalaHundiDetails;
