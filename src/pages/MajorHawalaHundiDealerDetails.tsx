import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { publicApi } from '../lib/api';

interface MajorHawalaHundiDealer {
  id: string;
  name: string;
  present_residence: string;
  domicile: string;
  is_fam_mem_dec_terr: boolean;
  affiliation_tgt_grp: string;
  remarks: string;
  is_active: boolean;
}

const MajorHawalaHundiDealerDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');
  
  const [dealerData, setDealerData] = useState<MajorHawalaHundiDealer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDealerDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await publicApi.get(`/ispec-hawala-hundi-dealers/get-single-ispec-hawala-hundi-dealer/${recordId}`);
        const data = response.data?.data || response.data;
        
        if (data) {
          setDealerData({
            id: data._id || data.id,
            name: data.name || '',
            present_residence: data.present_residence || '',
            domicile: data.domicile || '',
            is_fam_mem_dec_terr: data.is_fam_mem_dec_terr || false,
            affiliation_tgt_grp: data.affiliation_tgt_grp || 'None',
            remarks: data.remarks || '',
            is_active: data.is_active !== undefined ? data.is_active : true,
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching hawala/hundi dealer details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load dealer details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDealerDetails();
  }, [recordId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dealer details...</p>
        </div>
      </div>
    );
  }

  if (error || !dealerData) {
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
              <p className="text-muted-foreground">{error || 'Dealer record not found'}</p>
              <Button onClick={() => navigate('/illegal-spectrum/hawala-hundi')} variant="secondary">
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
          <h2 className="text-3xl font-bold text-foreground">Hawala/Hundi Dealer Details</h2>
          <p className="text-muted-foreground">Detailed information about the hawala/hundi dealer</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dealer Information</CardTitle>
            <CardDescription>Basic details of the hawala/hundi dealer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-foreground">{dealerData.name}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Present Residence</p>
                <p className="text-foreground">{dealerData.present_residence || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Domicile</p>
                <p className="text-foreground">{dealerData.domicile || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Affiliation with Target Group</p>
                <p className="text-foreground">{dealerData.affiliation_tgt_grp || 'None'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Family Member of Declared Terrorist</p>
                <div className="flex items-center">
                  {dealerData.is_fam_mem_dec_terr ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span>{dealerData.is_fam_mem_dec_terr ? 'Yes' : 'No'}</span>
                </div>
              </div>

{dealerData.remarks && (
                <div className="space-y-2 md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Remarks</p>
                  <p className="text-foreground whitespace-pre-line">{dealerData.remarks}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MajorHawalaHundiDealerDetails;
