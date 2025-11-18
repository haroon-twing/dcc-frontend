import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { CreditCard, Plus, Eye, Edit, Trash2, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import DeleteModal from '../UI/DeleteModal';
import BankAccountFormModal from '../modals/madaris/BankAccountFormModal';

interface BankAccount {
  _id?: string;
  id?: string;
  bank_name: string;
  acc_no: string;
  acc_title: string;
  branch_code: string;
  branch_address: string;
  remarks?: string;
  madaris_id: string;
}

interface BankAccountFormState {
  bank_name: string;
  acc_no: string;
  acc_title: string;
  branch_code: string;
  branch_address: string;
  remarks: string;
}

interface BankAccountsProps {
  madarisId: string;
}

const BankAccounts: React.FC<BankAccountsProps> = ({ madarisId }) => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [viewingAccount, setViewingAccount] = useState<BankAccount | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [accountToDeleteId, setAccountToDeleteId] = useState<string | number | undefined>(undefined);
  const [accountToDeleteName, setAccountToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<BankAccountFormState>({
    bank_name: '',
    acc_no: '',
    acc_title: '',
    branch_code: '',
    branch_address: '',
    remarks: '',
  });

  const buildInitialForm = (): BankAccountFormState => ({
    bank_name: '',
    acc_no: '',
    acc_title: '',
    branch_code: '',
    branch_address: '',
    remarks: '',
  });

  const fetchAccounts = useCallback(async () => {
    if (!madarisId) {
      setLoading(false);
      setAccounts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/madaris/get-bank-accounts/${madarisId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];

      const accountsData: BankAccount[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        madaris_id: item.madaris_id || madarisId,
        bank_name: item.bank_name || '',
        acc_no: item.acc_no || '',
        acc_title: item.acc_title || '',
        branch_code: item.branch_code || '',
        branch_address: item.branch_address || '',
        remarks: item.remarks || '',
      }));

      setAccounts(accountsData);
    } catch (err: any) {
      console.error('Error fetching bank accounts:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load bank accounts. Please try again.'
      );
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [madarisId]);

  useEffect(() => {
    if (madarisId) {
      fetchAccounts();
    }
  }, [madarisId, fetchAccounts]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingAccount(null);
    setViewingAccount(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = async (account: BankAccount) => {
    const accountId = account._id || account.id;
    if (!accountId) {
      alert('Account ID is missing. Cannot load account details.');
      return;
    }

    setLoadingAccount(true);
    setViewingAccount(account);
    setEditingAccount(null);
    setIsViewMode(true);

    try {
      const viewEndpoint = `/madaris/get-single-bank-account/${accountId}`;
      const response = await publicApi.get(viewEndpoint);
      const accountData = response.data?.data || response.data;

      setFormData({
        bank_name: accountData.bank_name || '',
        acc_no: accountData.acc_no || '',
        acc_title: accountData.acc_title || '',
        branch_code: accountData.branch_code || '',
        branch_address: accountData.branch_address || '',
        remarks: accountData.remarks || '',
      });

      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching bank account details:', error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load bank account details. Please try again.'
      );
      // Fallback to existing data
      setFormData({
        bank_name: account.bank_name || '',
        acc_no: account.acc_no || '',
        acc_title: account.acc_title || '',
        branch_code: account.branch_code || '',
        branch_address: account.branch_address || '',
        remarks: account.remarks || '',
      });
      setShowModal(true);
    } finally {
      setLoadingAccount(false);
    }
  };

  const handleEdit = (account: BankAccount) => {
    setFormData({
      bank_name: account.bank_name || '',
      acc_no: account.acc_no || '',
      acc_title: account.acc_title || '',
      branch_code: account.branch_code || '',
      branch_address: account.branch_address || '',
      remarks: account.remarks || '',
    });
    setEditingAccount(account);
    setViewingAccount(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (account: BankAccount) => {
    const accountId = account._id || account.id;
    if (accountId) {
      setAccountToDeleteId(accountId);
      const displayName = account.acc_no || account.bank_name || 'this bank account';
      setAccountToDeleteName(displayName);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/madaris/delete-bank-account/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setAccountToDeleteId(undefined);
      setAccountToDeleteName('');
      await fetchAccounts();
    } catch (error: any) {
      console.error('Error deleting bank account:', error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete bank account. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        bank_name: formData.bank_name,
        acc_no: formData.acc_no,
        acc_title: formData.acc_title,
        branch_code: formData.branch_code,
        branch_address: formData.branch_address,
        remarks: formData.remarks || '',
        madaris_id: madarisId,
      };

      if (editingAccount) {
        const accountId = editingAccount._id || editingAccount.id;
        if (!accountId) {
          throw new Error('Account ID is required for update');
        }
        const updateEndpoint = `/madaris/update-bank-account/${accountId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/madaris/add-bank-account';
        await api.post(addEndpoint, payload);
      }

      await fetchAccounts();

      setSubmitting(false);
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingAccount(null);
      setViewingAccount(null);
      setIsViewMode(false);
    } catch (err: any) {
      console.error('Error saving bank account:', err);
      alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingAccount ? 'update' : 'add'} bank account. Please try again.`
      );
      setSubmitting(false);
    }
  };

  // Filter and sort data
  const filteredAndSortedAccounts = useMemo(() => {
    let filtered = accounts;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = accounts.filter((account) => {
        return (
          (account.bank_name || '').toLowerCase().includes(searchLower) ||
          (account.acc_no || '').toLowerCase().includes(searchLower) ||
          (account.acc_title || '').toLowerCase().includes(searchLower) ||
          (account.branch_code || '').toLowerCase().includes(searchLower) ||
          (account.branch_address || '').toLowerCase().includes(searchLower) ||
          (account.remarks || '').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'bank_name':
            aValue = (a.bank_name || '').toLowerCase();
            bValue = (b.bank_name || '').toLowerCase();
            break;
          case 'acc_no':
            aValue = (a.acc_no || '').toLowerCase();
            bValue = (b.acc_no || '').toLowerCase();
            break;
          case 'acc_title':
            aValue = (a.acc_title || '').toLowerCase();
            bValue = (b.acc_title || '').toLowerCase();
            break;
          case 'branch_code':
            aValue = (a.branch_code || '').toLowerCase();
            bValue = (b.branch_code || '').toLowerCase();
            break;
          case 'branch_address':
            aValue = (a.branch_address || '').toLowerCase();
            bValue = (b.branch_address || '').toLowerCase();
            break;
          case 'remarks':
            aValue = (a.remarks || '').toLowerCase();
            bValue = (b.remarks || '').toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [accounts, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedAccounts.slice(startIndex, endIndex);
  }, [filteredAndSortedAccounts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedAccounts.length / itemsPerPage);

  // Handle sort click
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Get sort icon for column
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4 ml-1 text-primary" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1 text-primary" />;
  };

  // Reset search and filters
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Bank Accounts
              </CardTitle>
              <CardDescription>Bank accounts associated with this institution</CardDescription>
            </div>
            <Button
              onClick={handleAdd}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Bank Account
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search bank accounts..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading bank accounts...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAccounts()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredAndSortedAccounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No bank accounts found matching your search.' : 'No bank accounts found for this institution.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('bank_name')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Bank Name {getSortIcon('bank_name')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('acc_no')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Account Number {getSortIcon('acc_no')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('acc_title')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Account Title {getSortIcon('acc_title')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('branch_code')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Branch Code {getSortIcon('branch_code')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('branch_address')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Branch Address {getSortIcon('branch_address')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('remarks')}
                      className="flex items-center hover:text-foreground transition-colors"
                    >
                      Remarks {getSortIcon('remarks')}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAccounts.map((account) => (
                  <TableRow key={account._id || account.id}>
                    <TableCell className="font-medium">{account.bank_name || 'N/A'}</TableCell>
                    <TableCell className="font-mono text-sm">{account.acc_no || 'N/A'}</TableCell>
                    <TableCell>{account.acc_title || 'N/A'}</TableCell>
                    <TableCell className="font-mono text-sm">{account.branch_code || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={account.branch_address}>
                      {account.branch_address || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={account.remarks}>
                      {account.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(account)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(account)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(account)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
          </div>
        )}
        
        {/* Pagination */}
        {filteredAndSortedAccounts.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedAccounts.length)} of {filteredAndSortedAccounts.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-muted-foreground">...</span>;
                  }
                  return null;
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Bank Account Form Modal */}
      <BankAccountFormModal
        open={showModal}
        onOpenChange={(open) => {
          if (!submitting) {
            setShowModal(open);
            if (!open) {
              setFormData(buildInitialForm());
              setEditingAccount(null);
              setViewingAccount(null);
              setIsViewMode(false);
            }
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={isViewMode ? 'View Bank Account' : editingAccount ? 'Edit Bank Account' : 'Add Bank Account'}
        submitLabel={editingAccount ? 'Save Changes' : 'Add Bank Account'}
        submitting={submitting || loadingAccount}
        madarisId={madarisId}
        viewMode={isViewMode}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={accountToDeleteId}
        message={`Are you sure you want to delete bank account "${accountToDeleteName}"? This action cannot be undone.`}
        onSubmit={handleDeleteSubmit}
        deleting={deleting}
        title="Delete Bank Account"
      />
    </Card>
  );
};

export default BankAccounts;
