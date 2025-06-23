import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { FirestoreService } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import TransactionModal from "@/components/TransactionModal";
import type { Transaction } from "@shared/schema";
import { categories } from "@shared/schema";
import { Plus, Edit, Trash2, ShoppingCart, Briefcase, Car, Download } from "lucide-react";
import { exportToTXT, exportToPDF } from "@/lib/exportUtils";

export default function Transactions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    loadTransactions();
  }, [user?.id]);

  const loadTransactions = async () => {
    if (!user?.id) return;

    try {
      const data = await FirestoreService.getUserTransactions(user.id);
      setTransactions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (typeFilter && typeFilter !== "all" && transaction.type !== typeFilter) return false;
      if (categoryFilter && categoryFilter !== "all" && transaction.category !== categoryFilter) return false;
      if (fromDate && transaction.date < fromDate) return false;
      if (toDate && transaction.date > toDate) return false;
      return true;
    });
  }, [transactions, typeFilter, categoryFilter, fromDate, toDate]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleDelete = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;

    setDeleting(true);
    try {
      await FirestoreService.deleteTransaction(transactionToDelete);
      await loadTransactions();
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTransaction(null);
  };

  const getTransactionIcon = (category: string, type: string) => {
    if (type === "income") return <Briefcase className="w-4 h-4 text-green-600" />;
    
    switch (category) {
      case "food": return <ShoppingCart className="w-4 h-4 text-red-500" />;
      case "transport": return <Car className="w-4 h-4 text-yellow-600" />;
      default: return <ShoppingCart className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryLabel = (category: string, type: string) => {
    const categoryList = categories[type as keyof typeof categories] || [];
    return categoryList.find(c => c.value === category)?.label || category;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">Manage your transactions</p>
        </div>
        <div className="flex space-x-2">
          <Select onValueChange={(format) => {
            if (format === 'txt') {
              exportToTXT(filteredTransactions, 'transactions');
            } else if (format === 'pdf') {
              exportToPDF(filteredTransactions, 'transactions');
            }
          }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="txt">Export TXT</SelectItem>
              <SelectItem value="pdf">Export PDF</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setModalOpen(true)} size="sm" className="text-sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {[...categories.income, ...categories.expense].map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="from-date">From Date</Label>
              <Input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="to-date">To Date</Label>
              <Input
                id="to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {transactions.length === 0 
                ? "No transactions yet. Add your first transaction to get started."
                : "No transactions match your current filters."
              }
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-muted/25">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-muted">
                            {getTransactionIcon(transaction.category, transaction.type)}
                          </div>
                          <span className="font-medium text-foreground">
                            {transaction.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {getCategoryLabel(transaction.category, transaction.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={transaction.type === "income" ? "default" : "destructive"}
                        >
                          {transaction.type === "income" ? "Income" : "Expense"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {transaction.type === "income" ? "+" : "-"}$
                          {transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(transaction.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        transaction={editingTransaction}
        onSuccess={loadTransactions}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
