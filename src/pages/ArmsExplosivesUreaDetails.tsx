import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicApi } from '../lib/api';
import { Button } from '../components/UI/Button';
import { ArrowLeft, Edit, Trash2, Activity, AlertTriangle, Check, X, FileText, Users } from 'lucide-react';
import DeleteModal from '../components/UI/DeleteModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Badge } from '../components/UI/badge';

interface ArmsExplosivesUreaRecord {
  id: string;
  per_change_arms_inflow: number;
  per_change_explosive_inflow: number;
  per_change_illegal_urea_transportation: number;
  no_int_reports_shared_lea: number;
  no_letter_recvd_in_fdbk: number;
  per_recs_made_illegal_arms: number;
  is_recs_faster_than_mthly_inflow_ill_arms: boolean;
  per_recs_made_illegal_explosives: number;
  is_recs_faster_than_mthly_inflow_ill_exp: boolean;
  per_recs_made_illegal_urea: number;
  is_recs_faster_than_mthly_inflow_ill_urea: boolean;
  no_perpetrator_convicted: number;
  no_appreh_perp_set_freebycourt: number;
  no_perpetrator_case_remain_pending: number;
}

const ArmsExplosivesUreaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [record, setRecord] = useState<ArmsExplosivesUreaRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const response = await publicApi.get(`/ispec-arms-explosives/get-single-ispec-arms-explosives/${id}`);
        const data = response.data?.data || response.data;
        
        if (data) {
          setRecord({
            id: data._id || data.id || '',
            per_change_arms_inflow: data.per_change_arms_inflow || 0,
            per_change_explosive_inflow: data.per_change_explosive_inflow || 0,
            per_change_illegal_urea_transportation: data.per_change_illegal_urea_transportation || 0,
            no_int_reports_shared_lea: data.no_int_reports_shared_lea || 0,
            no_letter_recvd_in_fdbk: data.no_letter_recvd_in_fdbk || 0,
            per_recs_made_illegal_arms: data.per_recs_made_illegal_arms || 0,
            is_recs_faster_than_mthly_inflow_ill_arms: data.is_recs_faster_than_mthly_inflow_ill_arms || false,
            per_recs_made_illegal_explosives: data.per_recs_made_illegal_explosives || 0,
            is_recs_faster_than_mthly_inflow_ill_exp: data.is_recs_faster_than_mthly_inflow_ill_exp || false,
            per_recs_made_illegal_urea: data.per_recs_made_illegal_urea || 0,
            is_recs_faster_than_mthly_inflow_ill_urea: data.is_recs_faster_than_mthly_inflow_ill_urea || false,
            no_perpetrator_convicted: data.no_perpetrator_convicted || 0,
            no_appreh_perp_set_freebycourt: data.no_appreh_perp_set_freebycourt || 0,
            no_perpetrator_case_remain_pending: data.no_perpetrator_case_remain_pending || 0,
          });
        } else {
          throw new Error('Record not found');
        }
      } catch (err: any) {
        console.error('Error fetching record:', err);
        setError(err?.response?.data?.message || 'Failed to load record. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecord();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!record) return;
    
    try {
      setDeleting(true);
      await publicApi.delete(`/ispec-arms-explosives/delete-ispec-arms-explosives/${record.id}`);
      navigate('/illegal-spectrum/arms-explosives-urea');
    } catch (err: any) {
      console.error('Error deleting record:', err);
      setError(err?.response?.data?.message || 'Failed to delete record. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getValueColor = (value: number): string => {
    if (value > 0) return 'text-red-600 dark:text-red-400 font-medium';
    if (value < 0) return 'text-green-600 dark:text-green-400 font-medium';
    return 'text-foreground';
  };

  const formatPercentage = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading record details...</p>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/illegal-spectrum/arms-explosives-urea')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Record</CardTitle>
            <CardDescription>{error || 'The requested record could not be found.'}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/illegal-spectrum/arms-explosives-urea')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <h1 className="text-2xl font-bold">Arms / Explosives and Illegal Urea Record</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/illegal-spectrum/arms-explosives-urea/edit/${record.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Record
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Inflow Statistics
            </CardTitle>
            <CardDescription>Percentage changes in illegal inflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Arms Inflow</h3>
                  <Badge variant={record.per_change_arms_inflow > 0 ? 'destructive' : 'default'} className={record.per_change_arms_inflow <= 0 ? 'bg-green-500 hover:bg-green-600' : ''}>
                    {formatPercentage(record.per_change_arms_inflow)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Change in illegal arms inflow</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Explosives Inflow</h3>
                  <Badge variant={record.per_change_explosive_inflow > 0 ? 'destructive' : 'default'} className={record.per_change_explosive_inflow <= 0 ? 'bg-green-500 hover:bg-green-600' : ''}>
                    {formatPercentage(record.per_change_explosive_inflow)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Change in explosives inflow</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Illegal Urea</h3>
                  <Badge variant={record.per_change_illegal_urea_transportation > 0 ? 'destructive' : 'default'} className={record.per_change_illegal_urea_transportation <= 0 ? 'bg-green-500 hover:bg-green-600' : ''}>
                    {formatPercentage(record.per_change_illegal_urea_transportation)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Change in illegal urea transportation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Recommendations Status
            </CardTitle>
            <CardDescription>Effectiveness of recommendations made</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Arms</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={record.is_recs_faster_than_mthly_inflow_ill_arms ? 'default' : 'destructive'} className={record.is_recs_faster_than_mthly_inflow_ill_arms ? 'bg-green-500 hover:bg-green-600' : ''}>
                      {record.per_recs_made_illegal_arms}%
                    </Badge>
                    {record.is_recs_faster_than_mthly_inflow_ill_arms ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {record.is_recs_faster_than_mthly_inflow_ill_arms 
                    ? 'Recommendations effective' 
                    : 'Recommendations need improvement'}
                </p>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Explosives</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={record.is_recs_faster_than_mthly_inflow_ill_exp ? 'default' : 'destructive'} className={record.is_recs_faster_than_mthly_inflow_ill_exp ? 'bg-green-500 hover:bg-green-600' : ''}>
                      {record.per_recs_made_illegal_explosives}%
                    </Badge>
                    {record.is_recs_faster_than_mthly_inflow_ill_exp ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {record.is_recs_faster_than_mthly_inflow_ill_exp 
                    ? 'Recommendations effective' 
                    : 'Recommendations need improvement'}
                </p>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Illegal Urea</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={record.is_recs_faster_than_mthly_inflow_ill_urea ? 'default' : 'destructive'} className={record.is_recs_faster_than_mthly_inflow_ill_urea ? 'bg-green-500 hover:bg-green-600' : ''}>
                      {record.per_recs_made_illegal_urea}%
                    </Badge>
                    {record.is_recs_faster_than_mthly_inflow_ill_urea ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {record.is_recs_faster_than_mthly_inflow_ill_urea 
                    ? 'Recommendations effective' 
                    : 'Recommendations need improvement'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Perpetrator Cases
              </CardTitle>
              <CardDescription>Status of legal proceedings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Convicted</p>
                    <p className="text-sm text-muted-foreground">Successfully prosecuted cases</p>
                  </div>
                  <Badge variant="default" className="px-3 py-1">
                    {record.no_perpetrator_convicted}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Freed by Court</p>
                    <p className="text-sm text-muted-foreground">Acquitted or released</p>
                  </div>
                  <Badge variant="outline" className="px-3 py-1">
                    {record.no_appreh_perp_set_freebycourt}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pending Cases</p>
                    <p className="text-sm text-muted-foreground">Under trial or investigation</p>
                  </div>
                  <Badge variant="outline" className="px-3 py-1">
                    {record.no_perpetrator_case_remain_pending}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Reports & Feedback
              </CardTitle>
              <CardDescription>Intelligence sharing and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reports Shared</p>
                    <p className="text-sm text-muted-foreground">With law enforcement</p>
                  </div>
                  <Badge variant="outline" className="px-3 py-1">
                    {record.no_int_reports_shared_lea}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Feedback Received</p>
                    <p className="text-sm text-muted-foreground">From law enforcement</p>
                  </div>
                  <Badge variant="outline" className="px-3 py-1">
                    {record.no_letter_recvd_in_fdbk}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={record?.id}
        message="Are you sure you want to delete this record? This action cannot be undone."
        onSubmit={async () => {
          if (record?.id) {
            await handleDelete();
          }
        }}
        deleting={deleting}
        title="Delete Record"
      />
    </div>
  );
};

export default ArmsExplosivesUreaDetails;
