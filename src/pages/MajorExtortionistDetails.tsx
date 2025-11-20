import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, Loader2, User, Shield, FileText, AlertCircle, Target, Phone, Home, Users } from 'lucide-react';
import { publicApi } from '../lib/api';

interface MajorExtortionistData {
  name: string;
  present_Residence: string;
  domicile: string;
  mob_no: string;
  is_any_fam_mem_terr: boolean;
  affilication_with_terr_grp: string;
  model_ext: string;
  maj_tgt: string;
  remarks: string;
}

const MajorExtortionistDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');
  
  const [extortionistData, setExtortionistData] = useState<MajorExtortionistData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExtortionistDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const endpoint = `/ispec-extortion-major-ext-in-region/get-single-ispec-extortion-major-ext-in-region/${recordId}`;
        const response = await publicApi.get(endpoint);
        
        const data = response.data?.data || response.data;
        
        if (data) {
          setExtortionistData({
            name: data.name || '',
            present_Residence: data.present_Residence || '',
            domicile: data.domicile || '',
            mob_no: data.mob_no || '',
            is_any_fam_mem_terr: Boolean(data.is_any_fam_mem_terr),
            affilication_with_terr_grp: data.affilication_with_terr_grp || '',
            model_ext: data.model_ext || '',
            maj_tgt: data.maj_tgt || '',
            remarks: data.remarks || '',
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching extortionist details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load extortionist details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExtortionistDetails();
  }, [recordId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading extortionist details...</p>
        </div>
      </div>
    );
  }

  if (error || !extortionistData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/illegal-spectrum/extortion')}
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
              <p className="text-muted-foreground">{error || 'Extortionist record not found'}</p>
              <Button onClick={() => navigate('/illegal-spectrum/extortion')} variant="secondary">
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
              onClick={() => navigate('/illegal-spectrum/extortion')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Extortionist Details</h2>
          <p className="text-muted-foreground">
            Comprehensive information about the extortionist and their activities
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Extortionist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{extortionistData.name || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Terrorist Affiliation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">
              {extortionistData.affilication_with_terr_grp || 'Not specified'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Primary Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">
              {extortionistData.maj_tgt || 'Not specified'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-foreground">{extortionistData.name || 'N/A'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present Residence</p>
                  <p className="text-foreground">{extortionistData.present_Residence || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Domicile</p>
                  <p className="text-foreground">{extortionistData.domicile || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mobile Number</p>
                  <p className="text-foreground">{extortionistData.mob_no || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Family in Terrorism</p>
                  <p className="text-foreground">
                    {extortionistData.is_any_fam_mem_terr ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affiliation & Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-primary" />
              Affiliation & Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Terrorist Group Affiliation</p>
                <p className="text-foreground">{extortionistData.affilication_with_terr_grp || 'N/A'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Extortion Model</p>
                  <p className="text-foreground">{extortionistData.model_ext || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Primary Target</p>
                  <p className="text-foreground">{extortionistData.maj_tgt || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Remarks */}
      {extortionistData.remarks && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-primary" />
              Additional Remarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line text-foreground">{extortionistData.remarks}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MajorExtortionistDetails;
