import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, CheckCircle, XCircle, Loader2, Users, Shield, AlertTriangle, FileText } from 'lucide-react';
import { publicApi } from '../lib/api';

interface ActionAgainstIllegalVendorData {
  lea: string;
  ill_vend_apprehended: number;
  ill_vend_fined: number;
  remarks: string;
  createdAt?: string;
  updatedAt?: string;
}

const ActionAgainstIllegalVendorsDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');
  
  const [vendorData, setVendorData] = useState<ActionAgainstIllegalVendorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await publicApi.get(
          `/ispec-blackmarket-action-illegal-vendors/get-single-ispec-blackmarket-action-illegal-vendors/${recordId}`
        );
        
        const data = response.data?.data || response.data;
        
        if (data) {
          setVendorData({
            lea: data.lea || '',
            ill_vend_apprehended: data.ill_vend_apprehended || 0,
            ill_vend_fined: data.ill_vend_fined || 0,
            remarks: data.remarks || '',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching action against illegal vendor details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load action against illegal vendor details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [recordId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading action against illegal vendor details...</p>
        </div>
      </div>
    );
  }

  if (error || !vendorData) {
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
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-xl">Error Loading Record</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error || 'Failed to load the requested record.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
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
          <h1 className="text-2xl font-bold">Action Against Illegal Vendor</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Vendor Information</CardTitle>
          <CardDescription>
            Details of the action taken against the illegal vendor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Law Enforcement Agency</p>
              <p className="font-medium">{vendorData.lea}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Illegal Vendors Apprehended</p>
              <p className="font-medium">{vendorData.ill_vend_apprehended}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Illegal Vendors Fined</p>
              <p className="font-medium">{vendorData.ill_vend_fined}</p>
            </div>
            
            {vendorData.createdAt && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p className="text-sm">{new Date(vendorData.createdAt).toLocaleString()}</p>
              </div>
            )}
            
            {vendorData.updatedAt && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm">{new Date(vendorData.updatedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
          
          {vendorData.remarks && (
            <div className="space-y-2 pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground">Remarks</p>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="whitespace-pre-line">{vendorData.remarks}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionAgainstIllegalVendorsDetails;
