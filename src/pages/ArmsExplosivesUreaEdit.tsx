import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import publicApi from '../lib/api';
import api from '../lib/api';
import { Button } from '../components/UI/Button';
import { ArrowLeft, Save, X } from 'lucide-react';
import ArmsExplosivesUreaFormModal, { ArmsExplosivesUreaFormState } from '../components/modals/illegalspectrum/ArmsExplosivesUreaFormModal';

interface ArmsExplosivesUreaRecord extends ArmsExplosivesUreaFormState {
  id: string;
}

const ArmsExplosivesUreaEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<ArmsExplosivesUreaFormState>({
    per_change_arms_inflow: 0,
    per_change_explosive_inflow: 0,
    per_change_illegal_urea_transportation: 0,
    no_int_reports_shared_lea: 0,
    no_letter_recvd_in_fdbk: 0,
    per_recs_made_illegal_arms: 0,
    is_recs_faster_than_mthly_inflow_ill_arms: false,
    per_recs_made_illegal_explosives: 0,
    is_recs_faster_than_mthly_inflow_ill_exp: false,
    per_recs_made_illegal_urea: 0,
    is_recs_faster_than_mthly_inflow_ill_urea: false,
    no_perpetrator_convicted: 0,
    no_appreh_perp_set_freebycourt: 0,
    no_perpetrator_case_remain_pending: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) {
        setError('No record ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await publicApi.get(`/ispec-arms-explosives/get-single-ispec-arms-explosives/${id}`);
        const data = response.data?.data || response.data;
        
        if (data) {
          setFormData({
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

    fetchRecord();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      setError('No record ID provided');
      return;
    }

    try {
      setSaving(true);
      await api.put(`/ispec-arms-explosives/update-ispec-arms-explosives/${id}`, formData);
      
      // Navigate back to the list view after successful update
      navigate('/illegal-spectrum/arms-explosives-urea');
    } catch (err: any) {
      console.error('Error updating record:', err);
      setError(err?.response?.data?.message || 'Failed to update record. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading record details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-card rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Error Loading Record</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button onClick={() => navigate('/illegal-spectrum/arms-explosives-urea')}>
              Back to List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/illegal-spectrum/arms-explosives-urea')}
            className="w-9 px-0" 
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Arms / Explosives and Illegal Urea Record</h1>
        </div>
        <p className="text-muted-foreground ml-12">Editing record {id?.substring(0, 8)}...</p>
      </div>

      {/* Form */}
      <div className="bg-card rounded-lg border shadow-sm">
        <form onSubmit={handleSubmit} className="p-6">
          <ArmsExplosivesUreaFormModal
            open={true}
            onOpenChange={(open) => !open && navigate('/illegal-spectrum/arms-explosives-urea')}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            viewMode={false}
          />
          
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/illegal-spectrum/arms-explosives-urea/view/${id}`)}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArmsExplosivesUreaEdit;
