import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { publicApi } from '../lib/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    departmentId: '',
    sectionId: ''
  });
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Fetching form data...');
        console.log('📍 Current URL:', window.location.href);
        console.log('🌐 API Base URL:', process.env.REACT_APP_API_URL || 'http://192.168.103.40:5000/api');
        
        const [rolesRes, departmentsRes, sectionsRes] = await Promise.all([
          publicApi.get('/roles'),
          publicApi.get('/departments'),
          publicApi.get('/sections')
        ]);
        
        console.log('✅ Successfully fetched data:', {
          roles: rolesRes.data?.data?.length || 0,
          departments: departmentsRes.data?.data?.length || 0,
          sections: sectionsRes.data?.data?.length || 0
        });
        
        setRoles(rolesRes.data?.data || []);
        setDepartments(departmentsRes.data?.data || []);
        setSections(sectionsRes.data?.data || []);
        setError(''); // Clear any previous errors
      } catch (err: any) {
        console.error('❌ Error fetching data:', {
          message: err.message,
          code: err.code,
          status: err.response?.status,
          statusText: err.response?.statusText,
          url: err.config?.url,
          baseURL: err.config?.baseURL,
          fullError: err
        });
        
        let errorMessage = 'Failed to load form data. ';
        
        if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || err.message?.includes('Failed to fetch')) {
          errorMessage += 'Network error: Cannot reach the backend server at http://192.168.103.40:5000. ';
          errorMessage += 'Please check: 1) Backend is running, 2) Backend allows CORS from this IP, 3) Backend is listening on 0.0.0.0 (not just localhost)';
        } else if (err.code === 'ERR_CORS') {
          errorMessage += 'CORS error: Backend is blocking requests from this origin. Backend needs to allow CORS from http://192.168.103.43:3000';
        } else if (err.response?.status === 404) {
          errorMessage += 'API endpoint not found (404).';
        } else if (err.response?.status === 500) {
          errorMessage += 'Server error (500).';
        } else if (err.response?.data?.message) {
          errorMessage += err.response.data.message;
        } else {
          errorMessage += 'Please check browser console for details.';
        }
        
        setError(errorMessage);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roleId: formData.roleId,
        departmentId: formData.departmentId,
        sectionId: formData.sectionId || undefined
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white dark:bg-card p-10 rounded-lg shadow-sm border border-gray-200 dark:border-border w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">Register</h2>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold text-foreground">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-input dark:border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-foreground">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-3 py-2 border border-input dark:border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-foreground">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-3 py-2 border border-input dark:border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-semibold text-foreground">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full px-3 py-2 border border-input dark:border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-foreground">Role</label>
            <select
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
              required
              className="w-full px-3 py-2 border border-input dark:border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role._id} value={role._id}>{role.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-foreground">Department</label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value, sectionId: '' })}
              required
              className="w-full px-3 py-2 border border-input dark:border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-foreground">Section (Optional)</label>
            <select
              value={formData.sectionId}
              onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
              className="w-full px-3 py-2 border border-input dark:border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Section</option>
              {sections.filter(section => section.departmentId === formData.departmentId).map(section => (
                <option key={section._id} value={section._id}>{section.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-muted-foreground">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-blue-600 dark:text-purple-400 hover:text-blue-500 dark:hover:text-purple-300 font-medium transition-colors hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;