import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft } from 'lucide-react';
import { publicApi } from '../lib/api';

interface MajorModesAndMotivationsOfHumanTraffickingByDistrict {
  _id?: string;
  id?: string;
  dist_id: string;
  per_pop_trafficked_last_month: number;
  modes_ht: string;
  motivation_ht: string;
  remarks: string;
}

const MajorModesAndMotivationsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<MajorModesAndMotivationsOfHumanTraffickingByDistrict | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await publicApi.get(`/ispec-ht-modes-motivation-by-dist/get-single-ispec-ht-modes-motivation-by-dist/${id}`);
        const recordData = response.data?.data || response.data;
        
        if (recordData) {
          setRecord({
            _id: recordData._id,
            id: recordData.id,
            dist_id: recordData.dist_id,
            per_pop_trafficked_last_month: recordData.per_pop_trafficked_last_month,
            modes_ht: recordData.modes_ht,
            motivation_ht: recordData.motivation_ht,
            remarks: recordData.remarks,
          });
        } else {
          setError('Record not found');
        }
      } catch (err) {
        console.error('Error fetching record:', err);
        setError('Failed to load record. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error || 'Record not found'}</p>
          <Button 
            onClick={() => navigate(-1)} 
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <h1 className="text-2xl font-bold">Major Modes and Motivations Details</h1>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/illegal-spectrum/major-modes-edit/${record._id || record.id}`)}
          >
            Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>District Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">District ID</p>
              <p className="font-medium">{record.dist_id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">% Population Trafficked (Last Month)</p>
              <p className="font-medium">{record.per_pop_trafficked_last_month}%</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Modes of Human Trafficking</p>
              <p className="font-medium">{record.modes_ht || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Motivation of Human Trafficking</p>
              <p className="font-medium">{record.motivation_ht || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Remarks</p>
              <p className="font-medium">{record.remarks || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MajorModesAndMotivationsView;
