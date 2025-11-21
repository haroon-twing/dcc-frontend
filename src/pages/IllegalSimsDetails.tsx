import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, CheckCircle, XCircle, Loader2, Database, UserCheck, UserX, ShieldAlert, PhoneOff } from 'lucide-react';
import { publicApi } from '../lib/api';

interface IllegalSimsData {
  no_vend_selling_ill_sims: number;
  is_db_formed: boolean;
  no_vend_apprehended: number;
  no_vend_convicted: number;
  no_vend_setfree: number;
  no_cases_pending_appr_vendors: number;
  no_people_appr_using_ill_sims: number;
  no_people_appr_using_ill_sims_convicted: number;
  no_people_appr_using_ill_sims_setfree: number;
  no_cases_pending_appr_people: number;
  policy_action_taken: string;
  out_zone_sims_detected: number;
  afghan_sims_detected: number;
  per_out_zone_sims_found_to_be_afghan: number;
  remarks: string;
}

const IllegalSimsDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');
  
  const [illegalSimsData, setIllegalSimsData] = useState<IllegalSimsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIllegalSimsDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await publicApi.get(`/ispec-illegal-sims/get-single-ispec-illegal-sim/${recordId}`);
        
        const data = response.data?.data || response.data;
        
        if (data) {
          setIllegalSimsData({
            no_vend_selling_ill_sims: data.no_vend_selling_ill_sims || 0,
            is_db_formed: Boolean(data.is_db_formed),
            no_vend_apprehended: data.no_vend_apprehended || 0,
            no_vend_convicted: data.no_vend_convicted || 0,
            no_vend_setfree: data.no_vend_setfree || 0,
            no_cases_pending_appr_vendors: data.no_cases_pending_appr_vendors || 0,
            no_people_appr_using_ill_sims: data.no_people_appr_using_ill_sims || 0,
            no_people_appr_using_ill_sims_convicted: data.no_people_appr_using_ill_sims_convicted || 0,
            no_people_appr_using_ill_sims_setfree: data.no_people_appr_using_ill_sims_setfree || 0,
            no_cases_pending_appr_people: data.no_cases_pending_appr_people || 0,
            policy_action_taken: data.policy_action_taken || '',
            out_zone_sims_detected: data.out_zone_sims_detected || 0,
            afghan_sims_detected: data.afghan_sims_detected || 0,
            per_out_zone_sims_found_to_be_afghan: data.per_out_zone_sims_found_to_be_afghan || 0,
            remarks: data.remarks || ''
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching illegal sims details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load illegal sims details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIllegalSimsDetails();
  }, [recordId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading illegal sims details...</p>
        </div>
      </div>
    );
  }

  if (error || !illegalSimsData) {
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
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold text-foreground">Error Loading Details</p>
              <p className="text-muted-foreground">{error || 'Illegal Sims record not found'}</p>
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
          <h2 className="text-3xl font-bold text-foreground">Illegal Sims Details</h2>
          <p className="text-muted-foreground">
            Detailed information about illegal SIM card activities
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendors Selling</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{illegalSimsData.no_vend_selling_ill_sims}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendors Apprehended</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{illegalSimsData.no_vend_apprehended}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">People Apprehended</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{illegalSimsData.no_people_appr_using_ill_sims}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out Zone SIMs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{illegalSimsData.out_zone_sims_detected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Status
            </CardTitle>
            <CardDescription>Status of database for tracking illegal SIMs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Database Formed</p>
              <div className="flex items-center gap-2">
                {illegalSimsData.is_db_formed ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-lg font-semibold text-foreground">Yes</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-gray-400" />
                    <span className="text-lg font-semibold text-foreground">No</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Vendor Statistics
            </CardTitle>
            <CardDescription>Details about vendors involved in illegal SIM sales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Vendors Convicted</p>
              <p className="text-base text-foreground font-medium">{illegalSimsData.no_vend_convicted}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Vendors Set Free</p>
              <p className="text-base text-foreground font-medium">{illegalSimsData.no_vend_setfree}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Pending Cases (Vendors)</p>
              <p className="text-base text-foreground font-medium">{illegalSimsData.no_cases_pending_appr_vendors}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* People Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            People Using Illegal SIMs
          </CardTitle>
          <CardDescription>Statistics about people apprehended using illegal SIMs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Apprehended</p>
              <p className="text-2xl font-semibold text-foreground">{illegalSimsData.no_people_appr_using_ill_sims}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Convicted</p>
              <p className="text-2xl font-semibold text-foreground">{illegalSimsData.no_people_appr_using_ill_sims_convicted}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Set Free</p>
              <p className="text-2xl font-semibold text-foreground">{illegalSimsData.no_people_appr_using_ill_sims_setfree}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Pending Cases (People)</p>
            <p className="text-lg font-semibold text-foreground">{illegalSimsData.no_cases_pending_appr_people}</p>
          </div>
        </CardContent>
      </Card>

      {/* SIM Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneOff className="h-5 w-5" />
            SIM Card Statistics
          </CardTitle>
          <CardDescription>Details about illegal SIM cards detected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Out Zone SIMs Detected</p>
              <p className="text-2xl font-semibold text-foreground">{illegalSimsData.out_zone_sims_detected}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Afghan SIMs Detected</p>
              <p className="text-2xl font-semibold text-foreground">{illegalSimsData.afghan_sims_detected}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">% Out Zone SIMs Afghan</p>
              <p className="text-2xl font-semibold text-foreground">
                {illegalSimsData.per_out_zone_sims_found_to_be_afghan}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy and Remarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Policy Actions & Remarks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Policy Action Taken</p>
            <p className="text-foreground">
              {illegalSimsData.policy_action_taken || 'No policy actions recorded.'}
            </p>
          </div>
          {illegalSimsData.remarks && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Remarks</p>
              <p className="text-foreground">{illegalSimsData.remarks}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IllegalSimsDetails;
