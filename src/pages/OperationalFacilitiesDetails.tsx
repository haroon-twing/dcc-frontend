import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Loader2, ArrowLeft, Package, Hash, ClipboardList } from 'lucide-react';
import { publicApi } from '../lib/api';

interface OperationalFacilityDetailsData {
  type_of_equip: string;
  qty_available: number;
  remarks?: string;
}

const OperationalFacilitiesDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');

  const [facilityData, setFacilityData] = useState<OperationalFacilityDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilityDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const endpoint = `/intl-cycle-operational-facilities-piftac/get-single-intl-cycle-operational-facilities-piftac/${recordId}`;
        const response = await publicApi.get(endpoint);
        const data = response.data?.data || response.data;

        if (data) {
          setFacilityData({
            type_of_equip: data.type_of_equip || 'N/A',
            qty_available: typeof data.qty_available === 'number' ? data.qty_available : Number(data.qty_available) || 0,
            remarks: data.remarks || 'N/A',
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching operational facility details:', err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load operational facility details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityDetails();
  }, [recordId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading operational facility details...</p>
        </div>
      </div>
    );
  }

  if (error || !facilityData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/intelligence-cycle/operational-facilities-piftac')}
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
              <p className="text-muted-foreground">{error || 'Operational facility record not found'}</p>
              <Button onClick={() => navigate('/intelligence-cycle/operational-facilities-piftac')} variant="secondary">
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/intelligence-cycle/operational-facilities-piftac')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Operational Facility Details</h2>
          <p className="text-muted-foreground">Snapshot of the selected facility, its availability, and remarks</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Package className="h-4 w-4" />
              Type of Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{facilityData.type_of_equip}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Hash className="h-4 w-4" />
              Quantity Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{facilityData.qty_available}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Remarks
          </CardTitle>
          <CardDescription>Supplementary notes provided by the unit</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base text-foreground whitespace-pre-line">{facilityData.remarks || 'No remarks available.'}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperationalFacilitiesDetails;
