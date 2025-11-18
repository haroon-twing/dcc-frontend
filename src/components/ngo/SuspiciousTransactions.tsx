import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Button } from '../UI/Button';
import { AlertTriangle, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { publicApi } from '../../lib/api';
import api from '../../lib/api';
import DeleteModal from '../UI/DeleteModal';
import SuspiciousTransactionFormModal from '../modals/ngo/SuspiciousTransactionFormModal';

interface SuspiciousTransaction {
  _id?: string;
  id?: string;
  ngo_id: string;
  source_of_reported_transaction?: string;
  nature_susp_trans?: string;
  action_taken?: string;
  remarks?: string;
  transaction_date?: string;
  amount?: number;
  currency?: string;
  status?: string;
}

interface SuspiciousTransactionFormState {
  source_of_reported_transaction: string;
  nature_susp_trans: string;
  action_taken: string;
  remarks: string;
  transaction_date: string;
  amount: number;
  currency: string;
  status: string;
}

interface SuspiciousTransactionsProps {
  ngoId: string;
}

const SuspiciousTransactions: React.FC<SuspiciousTransactionsProps> = ({ ngoId }) => {
  const [transactions, setTransactions] = useState<SuspiciousTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<SuspiciousTransaction | null>(null);
  const [viewingTransaction, setViewingTransaction] = useState<SuspiciousTransaction | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingTransaction, setLoadingTransaction] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState<string | number | undefined>(undefined);
  const [transactionToDeleteName, setTransactionToDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // Search, Sort, and Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<SuspiciousTransactionFormState>({
    source_of_reported_transaction: '',
    nature_susp_trans: '',
    action_taken: '',
    remarks: '',
    transaction_date: '',
    amount: 0,
    currency: '',
    status: '',
  });

  const buildInitialForm = (): SuspiciousTransactionFormState => ({
    source_of_reported_transaction: '',
    nature_susp_trans: '',
    action_taken: '',
    remarks: '',
    transaction_date: '',
    amount: 0,
    currency: '',
    status: '',
  });

  const fetchTransactions = useCallback(async () => {
    if (!ngoId) {
      setLoading(false);
      setTransactions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = `/ngo/get-ngo-suspecious-transactions/${ngoId}`;
      const response = await publicApi.get(endpoint);
      const data = response.data?.data || response.data || [];
      
      const transactionsData: SuspiciousTransaction[] = data.map((item: any) => ({
        _id: item._id || item.id,
        id: item._id || item.id,
        ngo_id: item.ngo_id || ngoId,
        source_of_reported_transaction: item.source_of_reported_transaction || '',
        nature_susp_trans: item.nature_susp_trans || '',
        action_taken: item.action_taken || '',
        remarks: item.remarks || '',
        transaction_date: item.transaction_date || '',
        amount: item.amount || 0,
        currency: item.currency || '',
        status: item.status || '',
      }));
      
      setTransactions(transactionsData);
    } catch (err: any) {
      console.error('Error fetching suspicious transactions:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load suspicious transactions. Please try again.'
      );
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [ngoId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAdd = () => {
    setFormData(buildInitialForm());
    setEditingTransaction(null);
    setViewingTransaction(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleView = async (transaction: SuspiciousTransaction) => {
    const transactionId = transaction._id || transaction.id;
    if (!transactionId) {
      window.alert('Transaction ID is missing. Cannot load transaction details.');
      return;
    }

    setLoadingTransaction(true);
    setViewingTransaction(transaction);
    setEditingTransaction(null);
    setIsViewMode(true);

    try {
      const viewEndpoint = `/ngo/get-single-ngo-suspecious-transaction/${transactionId}`;
      const response = await publicApi.get(viewEndpoint);
      const transactionData: SuspiciousTransaction = response.data?.data || response.data;

      if (transactionData) {
        setFormData({
          source_of_reported_transaction: transactionData.source_of_reported_transaction || '',
          nature_susp_trans: transactionData.nature_susp_trans || '',
          action_taken: transactionData.action_taken || '',
          remarks: transactionData.remarks || '',
          transaction_date: transactionData.transaction_date || '',
          amount: transactionData.amount || 0,
          currency: transactionData.currency || '',
          status: transactionData.status || '',
        });
      } else {
        // Fallback to transaction data from table if API doesn't return data
        setFormData({
          source_of_reported_transaction: transaction.source_of_reported_transaction || '',
          nature_susp_trans: transaction.nature_susp_trans || '',
          action_taken: transaction.action_taken || '',
          remarks: transaction.remarks || '',
          transaction_date: transaction.transaction_date || '',
          amount: transaction.amount || 0,
          currency: transaction.currency || '',
          status: transaction.status || '',
        });
      }

      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching transaction details:', error);
      window.alert(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load transaction details. Please try again.'
      );
      setFormData({
        source_of_reported_transaction: transaction.source_of_reported_transaction || '',
        nature_susp_trans: transaction.nature_susp_trans || '',
        action_taken: transaction.action_taken || '',
        remarks: transaction.remarks || '',
        transaction_date: transaction.transaction_date || '',
        amount: transaction.amount || 0,
        currency: transaction.currency || '',
        status: transaction.status || '',
      });
      setShowModal(true);
    } finally {
      setLoadingTransaction(false);
    }
  };

  const handleEdit = (transaction: SuspiciousTransaction) => {
    setFormData({
      source_of_reported_transaction: transaction.source_of_reported_transaction || '',
      nature_susp_trans: transaction.nature_susp_trans || '',
      action_taken: transaction.action_taken || '',
      remarks: transaction.remarks || '',
      transaction_date: transaction.transaction_date || '',
      amount: transaction.amount || 0,
      currency: transaction.currency || '',
      status: transaction.status || '',
    });
    setEditingTransaction(transaction);
    setViewingTransaction(null);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleDelete = (transaction: SuspiciousTransaction) => {
    const transactionId = transaction._id || transaction.id;
    if (transactionId) {
      setTransactionToDeleteId(transactionId);
      setTransactionToDeleteName(transaction.nature_susp_trans || 'this suspicious transaction');
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSubmit = async (id: string | number) => {
    setDeleting(true);
    try {
      const deleteEndpoint = `/ngo/delete-ngo-suspecious-transaction/${id}`;
      await api.delete(deleteEndpoint);
      
      setShowDeleteModal(false);
      setTransactionToDeleteId(undefined);
      setTransactionToDeleteName('');
      await fetchTransactions();
    } catch (error: any) {
      console.error('Error deleting suspicious transaction:', error);
      window.alert(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete suspicious transaction. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Format transaction_date to YYYY-MM-DD format (remove time component)
      const formattedDate = formData.transaction_date 
        ? formData.transaction_date.split('T')[0] 
        : '';

      const payload = {
        source_of_reported_transaction: formData.source_of_reported_transaction,
        nature_susp_trans: formData.nature_susp_trans,
        action_taken: formData.action_taken,
        remarks: formData.remarks || '',
        transaction_date: formattedDate,
        amount: formData.amount,
        currency: formData.currency,
        status: formData.status,
        ngo_id: ngoId,
      };

      if (editingTransaction) {
        const transactionId = editingTransaction._id || editingTransaction.id;
        if (!transactionId) {
          throw new Error('Transaction ID is required for update');
        }
        const updateEndpoint = `/ngo/update-ngo-suspecious-transaction/${transactionId}`;
        await api.put(updateEndpoint, payload);
      } else {
        const addEndpoint = '/ngo/add-ngo-suspecious-transaction';
        await api.post(addEndpoint, payload);
      }

      // Refetch data after add/edit
      await fetchTransactions();

      setSubmitting(false);
      setShowModal(false);
      setFormData(buildInitialForm());
      setEditingTransaction(null);
      setViewingTransaction(null);
      setIsViewMode(false);
    } catch (err: any) {
      console.error('Error saving suspicious transaction:', err);
      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${editingTransaction ? 'update' : 'add'} suspicious transaction. Please try again.`
      );
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount: number, currency: string = 'PKR') => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter and sort data
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = transactions.filter((transaction) => {
        return (
          (transaction.source_of_reported_transaction || '').toLowerCase().includes(searchLower) ||
          (transaction.nature_susp_trans || '').toLowerCase().includes(searchLower) ||
          (transaction.action_taken || '').toLowerCase().includes(searchLower) ||
          (transaction.status || '').toLowerCase().includes(searchLower) ||
          (transaction.remarks || '').toLowerCase().includes(searchLower) ||
          (transaction.currency || '').toLowerCase().includes(searchLower) ||
          formatDate(transaction.transaction_date || '').toLowerCase().includes(searchLower) ||
          formatAmount(transaction.amount || 0, transaction.currency || 'PKR').toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case 'transaction_date':
            aValue = new Date(a.transaction_date || 0).getTime();
            bValue = new Date(b.transaction_date || 0).getTime();
            break;
          case 'amount':
            aValue = a.amount || 0;
            bValue = b.amount || 0;
            break;
          case 'source_of_reported_transaction':
            aValue = (a.source_of_reported_transaction || '').toLowerCase();
            bValue = (b.source_of_reported_transaction || '').toLowerCase();
            break;
          case 'nature_susp_trans':
            aValue = (a.nature_susp_trans || '').toLowerCase();
            bValue = (b.nature_susp_trans || '').toLowerCase();
            break;
          case 'status':
            aValue = (a.status || '').toLowerCase();
            bValue = (b.status || '').toLowerCase();
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
  }, [transactions, searchTerm, sortColumn, sortDirection]);

  // Paginate data
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedTransactions.slice(startIndex, endIndex);
  }, [filteredAndSortedTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Suspicious Transactions
          </CardTitle>
          <CardDescription>Suspicious transaction records for this NGO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading suspicious transactions...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Suspicious Transactions
          </CardTitle>
          <CardDescription>Suspicious transaction records for this NGO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600 dark:text-red-400">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Suspicious Transactions
              </CardTitle>
              <CardDescription>Suspicious transaction records for this NGO</CardDescription>
            </div>
            <Button size="sm" className="flex items-center gap-2" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
              Add Suspicious Transaction
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search suspicious transactions..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('transaction_date')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Transaction Date {getSortIcon('transaction_date')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('source_of_reported_transaction')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Source of Reported Transaction {getSortIcon('source_of_reported_transaction')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('nature_susp_trans')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Nature of Suspicious Transaction {getSortIcon('nature_susp_trans')}
                  </button>
                </TableHead>
                <TableHead>Action Taken</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Amount {getSortIcon('amount')}
                  </button>
                </TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center hover:text-foreground transition-colors"
                  >
                    Status {getSortIcon('status')}
                  </button>
                </TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No suspicious transactions found matching your search.' : 'No suspicious transactions found for this NGO.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction._id || transaction.id}>
                    <TableCell>{formatDate(transaction.transaction_date || '')}</TableCell>
                    <TableCell className="font-medium">{transaction.source_of_reported_transaction || 'N/A'}</TableCell>
                    <TableCell>{transaction.nature_susp_trans || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={transaction.action_taken}>
                      {transaction.action_taken || 'N/A'}
                    </TableCell>
                    <TableCell>{formatAmount(transaction.amount || 0, transaction.currency || 'PKR')}</TableCell>
                    <TableCell>{transaction.currency || 'N/A'}</TableCell>
                    <TableCell>{transaction.status || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate" title={transaction.remarks}>
                      {transaction.remarks || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="View"
                          onClick={() => handleView(transaction)}
                          disabled={loadingTransaction}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Edit"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                          onClick={() => handleDelete(transaction)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {filteredAndSortedTransactions.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)} of {filteredAndSortedTransactions.length} entries
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

      {/* Form Modal */}
      <SuspiciousTransactionFormModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setFormData(buildInitialForm());
            setEditingTransaction(null);
            setViewingTransaction(null);
            setIsViewMode(false);
          }
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        title={
          isViewMode
            ? 'View Suspicious Transaction'
            : editingTransaction
            ? 'Edit Suspicious Transaction'
            : 'Add Suspicious Transaction'
        }
        submitLabel={editingTransaction ? 'Update' : 'Save'}
        submitting={submitting}
        viewMode={isViewMode}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onSubmit={handleDeleteSubmit}
        id={transactionToDeleteId}
        message={`Are you sure you want to delete the suspicious transaction "${transactionToDeleteName}"? This action cannot be undone.`}
        deleting={deleting}
      />
    </Card>
  );
};

export default SuspiciousTransactions;


