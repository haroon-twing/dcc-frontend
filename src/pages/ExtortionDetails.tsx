import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, CheckCircle, XCircle, Loader2, Phone, Shield, AlertTriangle, FileText, Users, TrendingUp, MessageSquare } from 'lucide-react';
import { publicApi } from '../lib/api';

interface ExtortionData {
  is_db_ext_incidents_formed: boolean;
  is_classified_2types: boolean;
  is_estd_ct_helpline: boolean;
  no_calls_recvd_ct_helpline: number;
  is_public_awareness_develop: boolean;
  no_awareness_socialmedia: number;
  no_awareness_printmedia: number;
  no_awareness_electmedia: number;
  no_calls_unrelated_to_ct: number;
  no_calls_leading_action_taken_lea: number;
  no_ext_ident_shared_with_lea: number;
  no_ext_appreh_multiagency_effort: number;
  no_ext_neutr_multiagency_effort: number;
  no_ext_appreh_via_multiagency_convicted: number;
  no_ext_appreh_via_multiagency_freebycourt: number;
  no_ext_appreh_via_multiagency_case_pending: number;
}

const ExtortionDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');
  
  const [extortionData, setExtortionData] = useState<ExtortionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExtortionDetails = async () => {
      if (!recordId) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await publicApi.get(`/ispec-extortion/get-single-ispec-extortion/${recordId}`);
        const data = response.data?.data || response.data;
        
        if (data) {
          setExtortionData({
            is_db_ext_incidents_formed: Boolean(data.is_db_ext_incidents_formed),
            is_classified_2types: Boolean(data.is_classified_2types),
            is_estd_ct_helpline: Boolean(data.is_estd_ct_helpline),
            no_calls_recvd_ct_helpline: data.no_calls_recvd_ct_helpline || 0,
            is_public_awareness_develop: Boolean(data.is_public_awareness_develop),
            no_awareness_socialmedia: data.no_awareness_socialmedia || 0,
            no_awareness_printmedia: data.no_awareness_printmedia || 0,
            no_awareness_electmedia: data.no_awareness_electmedia || 0,
            no_calls_unrelated_to_ct: data.no_calls_unrelated_to_ct || 0,
            no_calls_leading_action_taken_lea: data.no_calls_leading_action_taken_lea || 0,
            no_ext_ident_shared_with_lea: data.no_ext_ident_shared_with_lea || 0,
            no_ext_appreh_multiagency_effort: data.no_ext_appreh_multiagency_effort || 0,
            no_ext_neutr_multiagency_effort: data.no_ext_neutr_multiagency_effort || 0,
            no_ext_appreh_via_multiagency_convicted: data.no_ext_appreh_via_multiagency_convicted || 0,
            no_ext_appreh_via_multiagency_freebycourt: data.no_ext_appreh_via_multiagency_freebycourt || 0,
            no_ext_appreh_via_multiagency_case_pending: data.no_ext_appreh_via_multiagency_case_pending || 0,
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: unknown) {
        const error = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
          message?: string;
        };
        
        console.error('Error fetching extortion details:', error);
        setError(
          error?.response?.data?.message || 
          error?.message || 
          'Failed to load extortion details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExtortionDetails();
  }, [recordId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading extortion details...</p>
        </div>
      </div>
    );
  }

  if (error || !extortionData) {
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
              <p className="text-muted-foreground">{error || 'Extortion record not found'}</p>
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
          <h2 className="text-3xl font-bold text-foreground">Extortion Record Details</h2>
          <p className="text-muted-foreground">
            Comprehensive information about extortion case and related activities
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Calls Received (CT Helpline)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{extortionData.no_calls_recvd_ct_helpline}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Apprehended</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{extortionData.no_ext_appreh_multiagency_effort}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Convicted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{extortionData.no_ext_appreh_via_multiagency_convicted}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{extortionData.no_ext_appreh_via_multiagency_case_pending}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Status Flags
            </CardTitle>
            <CardDescription>Key status indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">DB Extortion Incidents Formed</p>
              <div className="flex items-center gap-2">
                {extortionData.is_db_ext_incidents_formed ? (
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
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Classified 2 Types</p>
              <div className="flex items-center gap-2">
                {extortionData.is_classified_2types ? (
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
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">CT Helpline Established</p>
              <div className="flex items-center gap-2">
                {extortionData.is_estd_ct_helpline ? (
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
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Public Awareness Developed</p>
              <div className="flex items-center gap-2">
                {extortionData.is_public_awareness_develop ? (
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

        {/* CT Helpline Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              CT Helpline Statistics
            </CardTitle>
            <CardDescription>Call center and helpline data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Calls Received</p>
              <p className="text-base text-foreground font-medium">{extortionData.no_calls_recvd_ct_helpline}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Calls Unrelated to CT</p>
              <p className="text-base text-foreground font-medium">{extortionData.no_calls_unrelated_to_ct}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Calls Leading to Action Taken by LEA</p>
              <p className="text-base text-foreground font-medium">{extortionData.no_calls_leading_action_taken_lea}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Awareness Campaign Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Awareness Campaign Statistics
          </CardTitle>
          <CardDescription>Public awareness initiatives across different media</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Social Media</p>
              <p className="text-2xl font-semibold text-foreground">{extortionData.no_awareness_socialmedia}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Print Media</p>
              <p className="text-2xl font-semibold text-foreground">{extortionData.no_awareness_printmedia}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Electronic Media</p>
              <p className="text-2xl font-semibold text-foreground">{extortionData.no_awareness_electmedia}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Agency Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Multi-Agency Operations
          </CardTitle>
          <CardDescription>Collaborative efforts and outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Extortion Identified Shared with LEA</p>
              <p className="text-2xl font-semibold text-foreground">{extortionData.no_ext_ident_shared_with_lea}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Apprehended</p>
              <p className="text-2xl font-semibold text-foreground">{extortionData.no_ext_appreh_multiagency_effort}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Neutralized</p>
              <p className="text-2xl font-semibold text-foreground">{extortionData.no_ext_neutr_multiagency_effort}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Operations</p>
              <p className="text-2xl font-semibold text-foreground">
                {extortionData.no_ext_appreh_multiagency_effort + extortionData.no_ext_neutr_multiagency_effort}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Court Proceedings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Court Proceedings
          </CardTitle>
          <CardDescription>Status of cases in the judicial system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Convicted</p>
              <p className="text-2xl font-semibold text-foreground">{extortionData.no_ext_appreh_via_multiagency_convicted}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Freed by Court</p>
              <p className="text-2xl font-semibold text-foreground">{extortionData.no_ext_appreh_via_multiagency_freebycourt}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Pending Cases</p>
              <p className="text-2xl font-semibold text-foreground">{extortionData.no_ext_appreh_via_multiagency_case_pending}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtortionDetails;

