import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { FirestoreService } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import TransactionModal from "@/components/TransactionModal";
import { useLocation } from "wouter";
import type { Transaction } from "@shared/schema";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  ShoppingCart,
  Briefcase,
  Car,
  Plus,
  Download,
} from "lucide-react";
import { exportToTXT, exportToPDF } from "@/lib/exportUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { categories } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyStats = useMemo(() => {
    const currentMonthTransactions = transactions.filter(
      (t) => t.date.startsWith(currentMonth)
    );

    const income = currentMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income: income,
      expenses: expenses,
      balance: income - expenses,
    };
  }, [transactions, currentMonth]);

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  const categoryData = useMemo(() => {
    if (transactions.length === 0) return [];

    const categoryTotals = new Map<string, number>();

    transactions
      .filter((t) => t.type === "expense" && t.date && t.date.startsWith(currentMonth))
      .forEach((t) => {
        const current = categoryTotals.get(t.category) || 0;
        categoryTotals.set(t.category, current + (Number(t.amount) || 0));
      });

    return Array.from(categoryTotals.entries())
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => {
        const categoryInfo = categories.expense.find(c => c.value === category);
        return {
          name: categoryInfo?.label || category,
          value: Number(amount.toFixed(2)),
        };
      });
  }, [transactions, currentMonth]);

  const chartData = useMemo(() => {
    const last6Months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });

      const monthTransactions = transactions.filter(t => t.date && t.date.startsWith(monthKey));
      const expenses = monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      last6Months.push({
        month: monthName,
        spending: Number(expenses.toFixed(2)),
      });
    }

    // Add some sample data if no transactions exist to show chart structure
    const hasData = last6Months.some(month => month.spending > 0);
    if (!hasData && transactions.length === 0) {
      return [
        { month: 'Jan', spending: 0 },
        { month: 'Feb', spending: 0 },
        { month: 'Mar', spending: 0 },
        { month: 'Apr', spending: 0 },
        { month: 'May', spending: 0 },
        { month: 'Jun', spending: 0 },
      ];
    }

    return last6Months;
  }, [transactions]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#EC4899'];

  const getTransactionIcon = (category: string, type: string) => {
    if (type === "income") return <Briefcase className="w-4 h-4 text-green-600" />;

    switch (category) {
      case "food": return <ShoppingCart className="w-4 h-4 text-red-500" />;
      case "transport": return <Car className="w-4 h-4 text-yellow-600" />;
      default: return <ArrowDownCircle className="w-4 h-4 text-red-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your financial activity</p>
        </div>
        <div className="flex space-x-2">
          <Select onValueChange={(format) => {
            if (format === 'txt') {
              exportToTXT(transactions, 'transactions');
            } else if (format === 'pdf') {
              exportToPDF(transactions, 'transactions');
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
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ArrowUpCircle className="h-6 w-6 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">This month</span>
            </div>
            <h3 className="text-2xl font-medium text-foreground">
              ${monthlyStats.income.toFixed(2)}
            </h3>
            <p className="text-success text-sm font-medium mt-1">Total Income</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <ArrowDownCircle className="h-6 w-6 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">This month</span>
            </div>
            <h3 className="text-2xl font-medium text-foreground">
              ${monthlyStats.expenses.toFixed(2)}
            </h3>
            <p className="text-destructive text-sm font-medium mt-1">Total Expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Current</span>
            </div>
            <h3 className="text-2xl font-medium text-foreground">
              ${monthlyStats.balance.toFixed(2)}
            </h3>
            <p className="text-primary text-sm font-medium mt-1">Net Balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Spending']}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar
                    dataKey="spending"
                    radius={[6, 6, 0, 0]}
                    fill="url(#colorGradient)"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No expense data for this month
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/transactions")}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet. Add your first transaction to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                      {getTransactionIcon(transaction.category, transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {categories[transaction.type]?.find(c => c.value === transaction.category)?.label || transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === "income" ? "text-success" : "text-destructive"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={loadTransactions}
      />
    </div>
  );
}