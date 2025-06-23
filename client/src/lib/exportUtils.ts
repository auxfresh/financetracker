
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Transaction } from '@shared/schema';
import { categories } from '@shared/schema';

export const exportToTXT = (transactions: Transaction[], filename: string = 'transactions') => {
  let content = 'Transaction Report\n';
  content += '==================\n\n';
  
  // Summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netIncome = totalIncome - totalExpenses;
  
  content += `Summary:\n`;
  content += `Total Income: $${totalIncome.toFixed(2)}\n`;
  content += `Total Expenses: $${totalExpenses.toFixed(2)}\n`;
  content += `Net Income: $${netIncome.toFixed(2)}\n\n`;
  
  content += 'Transactions:\n';
  content += '-------------\n\n';
  
  transactions.forEach((transaction, index) => {
    const categoryLabel = categories[transaction.type]?.find(c => c.value === transaction.category)?.label || transaction.category;
    
    content += `${index + 1}. ${transaction.description}\n`;
    content += `   Type: ${transaction.type === 'income' ? 'Income' : 'Expense'}\n`;
    content += `   Category: ${categoryLabel}\n`;
    content += `   Amount: ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}\n`;
    content += `   Date: ${new Date(transaction.date).toLocaleDateString()}\n\n`;
  });
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToPDF = (transactions: Transaction[], filename: string = 'transactions') => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Transaction Report', 20, 20);
  
  // Summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netIncome = totalIncome - totalExpenses;
  
  doc.setFontSize(12);
  doc.text('Summary:', 20, 40);
  doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 20, 50);
  doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 20, 60);
  doc.text(`Net Income: $${netIncome.toFixed(2)}`, 20, 70);
  
  // Transactions table
  const tableData = transactions.map(transaction => {
    const categoryLabel = categories[transaction.type]?.find(c => c.value === transaction.category)?.label || transaction.category;
    return [
      transaction.description,
      categoryLabel,
      transaction.type === 'income' ? 'Income' : 'Expense',
      `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}`,
      new Date(transaction.date).toLocaleDateString()
    ];
  });
  
  autoTable(doc, {
    head: [['Description', 'Category', 'Type', 'Amount', 'Date']],
    body: tableData,
    startY: 85,
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fillColor: [66, 66, 66],
    },
    columnStyles: {
      3: { halign: 'right' }, // Amount column
    },
  });
  
  doc.save(`${filename}.pdf`);
};
