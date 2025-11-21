import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, Loader2, User, MapPin, Home, Shield, Package, AlertTriangle, Pencil } from 'lucide-react';
import { publicApi } from '../lib/api';

interface MajorBlackMarketVendorData {
  _id?: string;
  id?: string;
  name: string;
  present_address: string;
  domicile: string;
  is_fam_mem_terr: boolean;
  affiliation_with_terr_grp: string;
  main_trade: string;
  major_areas_supply: string;
  remarks: string;
}

const MajorBlackMarketVendorDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');
  
  const [vendorData, setVendorData] = useState<MajorBlackMarketVendorData | null>(null);
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
        const response = await publicApi.get(`/ispec-blackmarket-vendors-in-region/get-single-ispec-blackmarket-vendors-in-region/${recordId}`);
        
        const data = response.data?.data || response.data;
        
        if (data) {
          setVendorData({
            _id: data._id || data.id,
            id: data._id || data.id,
            name: data.name || '',
            present_address: data.present_address || '',
            domicile: data.domicile || '',
            is_fam_mem_terr: Boolean(data.is_fam_mem_terr),
            affiliation_with_terr_grp: data.affiliation_with_terr_grp || '',
            main_trade: data.main_trade || '',
            major_areas_supply: data.major_areas_supply || '',
            remarks: data.remarks || '',
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching vendor details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load vendor details. Please try again.'
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
          <p className="text-muted-foreground">Loading vendor details...</p>
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
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
        <div className="rounded-md bg-destructive/10 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">
                {error || 'Failed to load vendor details'}
              </h3>
              <div className="mt-2 text-sm text-destructive">
                <p>Please try again later or contact support if the problem persists.</p>
              </div>
            </div>
          </div>
        </div>
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
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <h1 className="text-2xl font-semibold">Vendor Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/illegal-spectrum/black-market-drones/vendors/edit?id=${vendorData.id}`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{vendorData.name}</CardTitle>
                <CardDescription>Vendor Information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Present Address</span>
                </div>
                <p className="text-sm font-medium">
                  {vendorData.present_address || 'Not specified'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Home className="h-4 w-4" />
                  <span>Domicile</span>
                </div>
                <p className="text-sm font-medium">
                  {vendorData.domicile || 'Not specified'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Family Member of Terrorist</span>
                </div>
                <p className="text-sm font-medium">
                  {vendorData.is_fam_mem_terr ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Affiliation with Terrorist Group</span>
                </div>
                <p className="text-sm font-medium">
                  {vendorData.affiliation_with_terr_grp || 'Not specified'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>Main Trade</span>
                </div>
                <p className="text-sm font-medium">
                  {vendorData.main_trade || 'Not specified'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Major Areas of Supply</span>
                </div>
                <p className="text-sm font-medium">
                  {vendorData.major_areas_supply || 'Not specified'}
                </p>
              </div>
            </div>

            {vendorData.remarks && (
              <div className="pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>Remarks</span>
                </div>
                <p className="text-sm">
                  {vendorData.remarks}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MajorBlackMarketVendorDetails;
