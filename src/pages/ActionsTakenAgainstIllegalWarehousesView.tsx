import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { ArrowLeft, Edit } from 'lucide-react';
import { publicApi } from '../lib/api';

interface ActionsTakenAgainstIllegalWarehouses {
  _id?: string;
  id?: string;
  action_taken_by: string;
  date_of_action: string;
  type: string;
  location: string;
  main_products: string;
  affiliated_terr_grp: string;
  remarks: string;
}

const ActionsTakenAgainstIllegalWarehousesView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<ActionsTakenAgainstIllegalWarehouses | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await publicApi.get(`/ispec-ill-whouse-action-taken/get-single-ispec-ill-whouse-action-taken/${id}`);
        const recordData = response.data?.data || response.data;
        
        if (recordData) {
          setRecord(recordData);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

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
      <div className="space-y-2">
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost" 
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <h1 className="text-2xl font-bold">Action Taken Against Illegal Warehouse</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Action Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Action Taken By</p>
              <p className="font-medium">{record.action_taken_by || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Action</p>
              <p className="font-medium">{formatDate(record.date_of_action)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{record.type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{record.location || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Main Products</p>
              <p className="font-medium">{record.main_products || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Affiliated Terrorist Group</p>
              <p className="font-medium">{record.affiliated_terr_grp || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Remarks</p>
              <p className="font-medium">{record.remarks || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionsTakenAgainstIllegalWarehousesView;
