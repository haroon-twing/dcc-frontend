import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Badge } from '../components/UI/badge';
import { Button } from '../components/UI/Button';
import { ArrowLeft, MapPin, Phone, Mail, Building, FileText, CheckCircle, XCircle, Loader2, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI/tabs';
import { publicApi } from '../lib/api';
import { fetchLookups } from '../lib/lookups';
import Meetings from '../components/ngo/Meetings';
import Investigated from '../components/ngo/Investigated';
import SuspiciousTransactions from '../components/ngo/SuspiciousTransactions';
import VerifiedCases from '../components/ngo/VerifiedCases';

interface NGOData {
  name: string;
  field_of_work: string;
  operating_area_district_id: string | null;
  operating_area_district_name: string;
  funding_source: string;
  known_affiliate_linkage?: string;
  ngo_category?: string;
  ngo_risk_level?: string;
  is_involve_financial_irregularities: boolean;
  is_against_national_interest: boolean;
  remarks?: string;
}

const NGODetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ngoId = searchParams.get('id');
  
  const [ngoData, setNgoData] = useState<NGOData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNGODetails = async () => {
      if (!ngoId) {
        setError('No NGO ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const endpoint = `/ngo-main/get-single-ngo-main/${ngoId}`;
        const response = await publicApi.get(endpoint);
        
        const data = response.data?.data || response.data;
        
        if (data) {
          // Fetch district name if operating_area_district_id exists
          let districtName = 'N/A';
          if (data.operating_area_district_id) {
            // Check if district is populated as an object
            if (typeof data.operating_area_district_id === 'object' && data.operating_area_district_id.name) {
              districtName = data.operating_area_district_id.name;
            } else {
              // District is an ID, fetch the name
              try {
                const lookups = await fetchLookups();
                const districtId = typeof data.operating_area_district_id === 'object' 
                  ? data.operating_area_district_id._id || data.operating_area_district_id.id
                  : data.operating_area_district_id;
                const district = lookups.districts?.find(
                  (d) => d._id === districtId
                );
                districtName = district?.name || String(districtId);
              } catch (err) {
                console.error('Error fetching district name:', err);
                districtName = typeof data.operating_area_district_id === 'object'
                  ? String(data.operating_area_district_id._id || data.operating_area_district_id.id)
                  : String(data.operating_area_district_id);
              }
            }
          }
          
          setNgoData({
            name: data.name || 'N/A',
            field_of_work: data.field_of_work || 'N/A',
            operating_area_district_id: data.operating_area_district_id || null,
            operating_area_district_name: districtName,
            funding_source: data.funding_source || 'N/A',
            known_affiliate_linkage: data.known_affiliate_linkage || undefined,
            ngo_category: data.ngo_category || undefined,
            ngo_risk_level: data.ngo_risk_level || undefined,
            is_involve_financial_irregularities: Boolean(data.is_involve_financial_irregularities),
            is_against_national_interest: Boolean(data.is_against_national_interest),
            remarks: data.remarks || undefined,
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching NGO details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load NGO details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNGODetails();
  }, [ngoId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading NGO details...</p>
        </div>
      </div>
    );
  }

  if (error || !ngoData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ngo/list')}
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
              <p className="text-muted-foreground">{error || 'NGO not found'}</p>
              <Button onClick={() => navigate('/ngo/list')} variant="secondary">
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
              onClick={() => navigate('/ngo/list')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">{ngoData.name}</h2>
          <p className="text-muted-foreground">
            Detailed information about the NGO
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Field of Work</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{ngoData.field_of_work}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Operating Area District</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{ngoData.operating_area_district_name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Financial Irregularities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {ngoData.is_involve_financial_irregularities ? (
                <>
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="text-lg font-semibold text-foreground">Yes</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-lg font-semibold text-foreground">No</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Against National Interest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {ngoData.is_against_national_interest ? (
                <>
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="text-lg font-semibold text-foreground">Yes</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-lg font-semibold text-foreground">No</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Core details about the NGO</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-base text-foreground font-medium">{ngoData.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Field of Work</p>
              <p className="text-base text-foreground">{ngoData.field_of_work}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Operating Area District</p>
              <p className="text-base text-foreground">{ngoData.operating_area_district_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Funding Source</p>
              <p className="text-base text-foreground">{ngoData.funding_source}</p>
            </div>
            {ngoData.ngo_category && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">NGO Category</p>
                <p className="text-base text-foreground">{ngoData.ngo_category}</p>
              </div>
            )}
            {ngoData.ngo_risk_level && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">NGO Risk Level</p>
                <Badge 
                  className={
                    ngoData.ngo_risk_level === 'high' 
                      ? 'bg-red-600 hover:bg-red-700'
                      : ngoData.ngo_risk_level === 'medium'
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }
                >
                  {ngoData.ngo_risk_level.charAt(0).toUpperCase() + ngoData.ngo_risk_level.slice(1)}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Additional Information
            </CardTitle>
            <CardDescription>Additional details and notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ngoData.known_affiliate_linkage && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Known Affiliate Linkage</p>
                <p className="text-base text-foreground">{ngoData.known_affiliate_linkage}</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Financial Irregularities</p>
              <div className="flex items-center gap-2">
                {ngoData.is_involve_financial_irregularities ? (
                  <Badge variant="destructive">Yes</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-600">No</Badge>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Against National Interest</p>
              <div className="flex items-center gap-2">
                {ngoData.is_against_national_interest ? (
                  <Badge variant="destructive">Yes</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-600">No</Badge>
                )}
              </div>
            </div>
            {ngoData.remarks && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Remarks</p>
                <p className="text-base text-foreground whitespace-pre-wrap">
                  {ngoData.remarks}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="meetings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="investigated">Investigated</TabsTrigger>
          <TabsTrigger value="suspicious-transactions">Suspicious Transactions</TabsTrigger>
          <TabsTrigger value="verified-cases">Verified Cases</TabsTrigger>
        </TabsList>
        <TabsContent value="meetings" className="mt-4">
          <Meetings ngoId={ngoId || ''} />
        </TabsContent>
        <TabsContent value="investigated" className="mt-4">
          <Investigated ngoId={ngoId || ''} />
        </TabsContent>
        <TabsContent value="suspicious-transactions" className="mt-4">
          <SuspiciousTransactions ngoId={ngoId || ''} />
        </TabsContent>
        <TabsContent value="verified-cases" className="mt-4">
          <VerifiedCases ngoId={ngoId || ''} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NGODetails;

