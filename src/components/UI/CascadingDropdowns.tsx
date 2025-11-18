import React, { useState, useEffect, useRef } from 'react';
import Select from './Select';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface Department {
  _id: string;
  name: string;
}

interface Section {
  _id: string;
  name: string;
  _count?: { users: number };
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface CascadingDropdownsProps {
  onSelectionChange: (data: {
    departmentId: string;
    sectionId: string;
    assignedUserIds: string[];
  }) => void;
  selectedDepartmentId?: string;
  selectedSectionId?: string;
  selectedUserIds?: string[];
  required?: boolean;
  showOnlyAssignedUsers?: boolean;
  leadAssignedUserIds?: string[];
}

const CascadingDropdowns: React.FC<CascadingDropdownsProps> = ({
  onSelectionChange,
  selectedDepartmentId = '',
  selectedSectionId = '',
  selectedUserIds = [],
  required = false,
  showOnlyAssignedUsers = false,
  leadAssignedUserIds = []
}) => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [departmentId, setDepartmentId] = useState(selectedDepartmentId);
  const [sectionId, setSectionId] = useState(selectedSectionId);
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>(selectedUserIds);
  const prevLeadAssignedUserIds = useRef<string[]>([]);

  // Fetch departments on mount
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data?.data || []);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    }
    fetchDepartments();
  }, []);

  // Fetch sections when department changes
  useEffect(() => {
    const fetchSections = async () => {
      if (!departmentId) {
        setSections([]);
        setSectionId('');
        setUsers([]);
        setAssignedUserIds([]);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get(`/sections/by-department/${departmentId}`);
        setSections(res.data?.data || []);
        
        // Reset section and users if department changed
        if (departmentId !== selectedDepartmentId) {
          setSectionId('');
          setUsers([]);
          setAssignedUserIds([]);
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
        setSections([]);
      }
      setLoading(false);
    };

    fetchSections();
  }, [departmentId, selectedDepartmentId]);

  // Fetch users when section changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!sectionId) {
        setUsers([]);
        setAssignedUserIds([]);
        return;
      }

      setLoading(true);
      try {
        let usersData: User[] = [];
        
        if (showOnlyAssignedUsers && leadAssignedUserIds.length > 0) {
          // Fetch only assigned users
          const res = await api.get(`/users`);
          const allUsers = res.data?.data || [];
          usersData = allUsers.filter((u: User) => leadAssignedUserIds.includes(u._id));
        } else {
          // Fetch users by section
          const res = await api.get(`/users/by-section/${sectionId}`);
          usersData = res.data?.users || [];
        }
        
        // Exclude logged-in user from the list
        usersData = usersData.filter((u: User) => u._id !== user?.id);
        
        setUsers(usersData);
        
        // Reset assigned users if section changed
        if (sectionId !== selectedSectionId) {
          setAssignedUserIds([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [sectionId, selectedSectionId, showOnlyAssignedUsers, user?.id]);

  // Handle leadAssignedUserIds changes when showOnlyAssignedUsers is true
  useEffect(() => {
    if (showOnlyAssignedUsers && leadAssignedUserIds.length > 0) {
      // Check if leadAssignedUserIds actually changed
      const hasChanged = JSON.stringify(leadAssignedUserIds) !== JSON.stringify(prevLeadAssignedUserIds.current);
      
      if (hasChanged) {
        prevLeadAssignedUserIds.current = leadAssignedUserIds;
        
        const fetchAssignedUsers = async () => {
          setLoading(true);
          try {
            const res = await api.get(`/users`);
            const allUsers = res.data?.data || [];
            const usersData = allUsers.filter((u: User) => 
              leadAssignedUserIds.includes(u._id) && u._id !== user?.id
            );
            setUsers(usersData);
          } catch (error) {
            console.error('Error fetching assigned users:', error);
            setUsers([]);
          }
          setLoading(false);
        };
        fetchAssignedUsers();
      }
    }
  }, [leadAssignedUserIds, showOnlyAssignedUsers, user?.id]);

  // Notify parent of changes
  useEffect(() => {
    onSelectionChange({
      departmentId,
      sectionId,
      assignedUserIds
    });
  }, [departmentId, sectionId, assignedUserIds]);

  const handleDepartmentChange = (value: string) => {
    setDepartmentId(value);
  };

  const handleSectionChange = (value: string) => {
    setSectionId(value);
  };

  const handleUserToggle = (userId: string) => {
    setAssignedUserIds(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Department {required && <span className="text-red-500">*</span>}
        </label>
        <Select
          value={departmentId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleDepartmentChange(e.target.value)}
          required={required}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section {required && <span className="text-red-500">*</span>}
        </label>
        <Select
          value={sectionId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSectionChange(e.target.value)}
          disabled={!departmentId || loading}
          required={required}
        >
          <option value="">Select Section</option>
          {sections.map((section) => (
            <option key={section._id} value={section._id}>
              {section.name} ({section._count?.users || 0} users)
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign to Users (Optional)
        </label>
        {!sectionId ? (
          <p className="text-sm text-gray-500">Select a section first</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-gray-500">No users in this section</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
            {users.map((user) => (
              <label key={user._id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignedUserIds.includes(user._id)}
                  onChange={() => handleUserToggle(user._id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">
                  {user.name} ({user.email})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CascadingDropdowns;