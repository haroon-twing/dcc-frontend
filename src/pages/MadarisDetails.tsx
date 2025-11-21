import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';
import { Badge } from '../components/UI/badge';
import { Button } from '../components/UI/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI/tabs';
import { ArrowLeft, MapPin, Phone, Mail, Building, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { publicApi } from '../lib/api';
import { fetchWafaqs, type WafaqOption } from '../lib/lookups';
import MadarisTeachers from '../components/madaris/MadarisTeachers';
import MadarisStudents from '../components/madaris/MadarisStudents';
import VocationalSkills from '../components/madaris/VocationalSkills';
import TeachersSupportHE from '../components/madaris/TeachersSupportHE';
import InternationalStandard from '../components/madaris/InternationalStandard';
import BankAccounts from '../components/madaris/BankAccounts';
import MeetingHeld from '../components/madaris/MeetingHeld';
import SubjectsUpdation from '../components/madaris/SubjectsUpdation';
import Curriculum from '../components/madaris/Curriculum';
import VocationalTraining from '../components/madaris/VocationalTraining';
import FundingSource from '../components/madaris/FundingSource';

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  Review: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
  Inactive: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  active: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  inactive: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
};

interface MadarisData {
  name: string;
  reg_no: string;
  province: string;
  district: string;
  location: string;
  phone: string;
  email?: string;
  is_reg: boolean;
  reg_from_wafaq: string;
  school_of_thought: string;
  status: string;
  cooperative: boolean;
  no_of_local_students?: number;
  category?: string;
  non_cooperation_reason?: string;
  long: string;
  lat: string;
  remarks: string;
}

const MadarisDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const madarisId = searchParams.get('id');
  
  const [madarisData, setMadarisData] = useState<MadarisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [wafaqs, setWafaqs] = useState<WafaqOption[]>([]);

  // Fetch wafaqs for lookup
  useEffect(() => {
    const loadWafaqs = async () => {
      try {
        const wafaqsData = await fetchWafaqs();
        setWafaqs(wafaqsData);
      } catch (error) {
        console.error('Error loading wafaqs:', error);
      }
    };
    loadWafaqs();
  }, []);

  // Update wafaq name when wafaqs are loaded and madaris data exists
  useEffect(() => {
    if (wafaqs.length > 0 && madarisData && madarisData.reg_from_wafaq) {
      // Try to resolve the wafaq name if it's currently an ID or needs lookup
      const currentValue = madarisData.reg_from_wafaq;
      
      // Check if current value is an ID that needs to be resolved
      const wafaqById = wafaqs.find((w) => w._id === currentValue);
      if (wafaqById && wafaqById.wafaq_name !== currentValue) {
        // Update the wafaq name
        setMadarisData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            reg_from_wafaq: wafaqById.wafaq_name,
          };
        });
      } else {
        // Check if it's a name that exists in wafaqs (already correct)
        const wafaqByName = wafaqs.find((w) => w.wafaq_name === currentValue);
        if (!wafaqByName && currentValue !== 'N/A') {
          // If it's not found and not N/A, it might be an ID that wasn't found
          // Try to look it up one more time
          const foundWafaq = wafaqs.find((w) => w._id === currentValue);
          if (foundWafaq) {
            setMadarisData((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                reg_from_wafaq: foundWafaq.wafaq_name,
              };
            });
          }
        }
      }
    }
  }, [wafaqs, madarisData]);

  useEffect(() => {
    const fetchMadarisDetails = async () => {
      if (!madarisId) {
        setError('No madaris ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const endpoint = `/view-single-madaris/${madarisId}`;
        const response = await publicApi.get(endpoint);
        
        const data = response.data?.data || response.data;
        
        if (data) {
          // Determine wafaq name - could be stored as object, ID, or name string
          let wafaqName = 'N/A';
          
          if (data.reg_from_wafaq) {
            // Check if it's an object with wafaq_name or _id
            if (typeof data.reg_from_wafaq === 'object' && data.reg_from_wafaq !== null) {
              // If it's an object, use wafaq_name if available, or look up by _id
              if (data.reg_from_wafaq.wafaq_name) {
                wafaqName = data.reg_from_wafaq.wafaq_name;
              } else if (data.reg_from_wafaq._id && wafaqs.length > 0) {
                const wafaqById = wafaqs.find((w) => w._id === data.reg_from_wafaq._id);
                wafaqName = wafaqById?.wafaq_name || 'N/A';
              }
            } else if (typeof data.reg_from_wafaq === 'string') {
              // If it's a string, check if it's an ID or a name
              if (wafaqs.length > 0) {
                // First check if it's an ID
                const wafaqById = wafaqs.find((w) => w._id === data.reg_from_wafaq);
                if (wafaqById) {
                  wafaqName = wafaqById.wafaq_name;
                } else {
                  // Check if it's already a name by matching
                  const wafaqByName = wafaqs.find((w) => w.wafaq_name === data.reg_from_wafaq);
                  if (wafaqByName) {
                    wafaqName = wafaqByName.wafaq_name;
                  } else {
                    // Use the value as-is (might already be a name)
                    wafaqName = data.reg_from_wafaq;
                  }
                }
              } else {
                // Wafaqs not loaded yet, use the value as-is
                wafaqName = data.reg_from_wafaq;
              }
            }
          }
          
          setMadarisData({
            name: data.name || 'N/A',
            reg_no: data.reg_no || 'N/A',
            province: data.prov_id?.name || '-',
            district: data.district_id?.name || '-',
            location: data.location || 'N/A',
            phone: data.phone || 'N/A',
            email: data.email || undefined,
            is_reg: Boolean(data.is_reg),
            reg_from_wafaq: wafaqName,
            school_of_thought: data.school_of_thought || 'N/A',
            status: data.status || 'active',
            cooperative: Boolean(data.cooperative ?? data.cooperation_status), // Support both for backward compatibility
            no_of_local_students: data.no_of_local_students || 0,
            category: data.category || '',
            non_cooperation_reason: data.non_cooperation_reason || '',
            long: data.long || 'N/A',
            lat: data.lat || 'N/A',
            remarks: data.remarks || 'No remarks available.',
          });
        } else {
          setError('No data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching madaris details:', err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          'Failed to load madaris details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMadarisDetails();
  }, [madarisId, wafaqs]);

  // Fetch students data to calculate total students
  useEffect(() => {
    const fetchStudentsTotal = async () => {
      if (!madarisId) {
        return;
      }

      try {
        const endpoint = `/madaris/get-all-madaris-students/${madarisId}`;
        const response = await publicApi.get(endpoint);
        const data = response.data?.data || response.data || [];
        
        // Calculate total by summing all total_foreign_students
        const total = data.reduce((sum: number, student: any) => {
          return sum + (student.total_foreign_students || 0);
        }, 0);
        
        setTotalStudents(total);
      } catch (err: any) {
        console.error('Error fetching students for total calculation:', err);
        // Don't set error, just keep total as 0
        setTotalStudents(0);
      }
    };

    if (madarisId) {
      fetchStudentsTotal();
    }
  }, [madarisId]);

  const formatStatus = (status: string) => {
    if (!status) return 'Active';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading madaris details...</p>
        </div>
      </div>
    );
  }

  if (error || !madarisData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/madaris/list')}
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
              <p className="text-muted-foreground">{error || 'Madaris not found'}</p>
              <Button onClick={() => navigate('/madaris/list')} variant="secondary">
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
              onClick={() => navigate('/madaris/list')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
          <h2 className="text-3xl font-bold text-foreground">{madarisData.name}</h2>
          <p className="text-muted-foreground">
            Detailed information and status of the institution
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
            statusColors[madarisData.status] || 'bg-muted text-foreground'
          }`}>
            {formatStatus(madarisData.status)}
          </span>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {madarisData.is_reg ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-lg font-semibold text-foreground">Registered</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-lg font-semibold text-foreground">Unregistered</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cooperation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {madarisData.cooperative ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-lg font-semibold text-foreground">Cooperative</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-lg font-semibold text-foreground">Non-Cooperative</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Category</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{madarisData.category || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Province</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{madarisData.province}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">District</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">{madarisData.district}</p>
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
            <CardDescription>Core details about the institution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Registration Number</p>
              <p className="text-base text-foreground font-medium">{madarisData.reg_no}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">School of Thought</p>
              <p className="text-base text-foreground">{madarisData.school_of_thought}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Registered From Wafaq</p>
              <p className="text-base text-foreground">{madarisData.reg_from_wafaq}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <p className="text-base text-foreground font-medium">{totalStudents}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>Ways to reach the institution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-base text-foreground">{madarisData.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-base text-foreground">{madarisData.phone}</p>
              </div>
            </div>
            {madarisData.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base text-foreground">{madarisData.email}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="teachers" className="w-full">
        <div className="space-y-2">
          {/* Row 1 */}
          <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="vocational-skills">Vocational Skills</TabsTrigger>
            <TabsTrigger value="teachers-support">Teachers Support (HE)</TabsTrigger>
            <TabsTrigger value="international-standard">International Standard</TabsTrigger>
            <TabsTrigger value="bank-accounts">Bank Accounts</TabsTrigger>
          </TabsList>
          {/* Row 2 */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meeting-held">Meeting Held</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="vocational-training">Vocational Training</TabsTrigger>
            <TabsTrigger value="funding-source">Funding Source</TabsTrigger>
        </TabsList>
        </div>
        <TabsContent value="teachers" className="mt-4">
          <MadarisTeachers madarisId={madarisId || ''} />
        </TabsContent>
        <TabsContent value="students" className="mt-4">
          <MadarisStudents madarisId={madarisId || ''} />
        </TabsContent>
        <TabsContent value="vocational-skills" className="mt-4">
          <VocationalSkills madarisId={madarisId || ''} />
        </TabsContent>
        <TabsContent value="teachers-support" className="mt-4">
          <TeachersSupportHE madarisId={madarisId || ''} />
        </TabsContent>
        <TabsContent value="international-standard" className="mt-4">
          <InternationalStandard madarisId={madarisId || ''} />
        </TabsContent>
        <TabsContent value="bank-accounts" className="mt-4">
          <BankAccounts madarisId={madarisId || ''} />
        </TabsContent>
        <TabsContent value="meeting-held" className="mt-4">
          <MeetingHeld madarisId={madarisId || ''} />
        </TabsContent>
        <TabsContent value="subjects-updation" className="mt-4">
          <SubjectsUpdation madarisId={madarisId || ''} />
        </TabsContent>
        <TabsContent value="curriculum" className="mt-4">
          <Curriculum madarisId={madarisId || ''} />
        </TabsContent>
        <TabsContent value="vocational-training" className="mt-4">
          <VocationalTraining madarisId={madarisId || ''} />
        </TabsContent>
        <TabsContent value="funding-source" className="mt-4">
          <FundingSource madarisId={madarisId || ''} />
        </TabsContent>
      </Tabs>

      {/* Location Coordinates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Coordinates
          </CardTitle>
          <CardDescription>GPS coordinates for mapping and location services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Longitude</p>
              <p className="text-base text-foreground font-mono">{madarisData.long}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Latitude</p>
              <p className="text-base text-foreground font-mono">{madarisData.lat}</p>
            </div>
          </div>
          {madarisData.long && madarisData.lat && madarisData.long !== 'N/A' && madarisData.lat !== 'N/A' && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Map Preview</p>
              <div className="w-full h-48 bg-background border rounded-md flex items-center justify-center text-muted-foreground">
                Map view would be displayed here
              </div>
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
          <CardDescription>Remarks and additional notes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {madarisData.non_cooperation_reason && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Non-Cooperation Reason</p>
                <p className="text-base text-foreground whitespace-pre-wrap bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                  {madarisData.non_cooperation_reason}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Remarks</p>
              <p className="text-base text-foreground whitespace-pre-wrap">
                {madarisData.remarks}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MadarisDetails;
