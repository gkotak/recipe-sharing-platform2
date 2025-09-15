'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  History, 
  ArrowUpCircle, 
  CreditCard,
  MoreHorizontal
} from 'lucide-react';

const transactions = [
  {
    id: 1,
    type: 'topup',
    amount: 50.00,
    description: 'Credits top-up via Visa ending in 4242',
    date: '2024-01-15',
    status: 'completed',
    method: 'Visa •••• 4242'
  },
  {
    id: 2,
    type: 'topup',
    amount: 25.00,
    description: 'Auto-refill via Visa ending in 4242',
    date: '2024-01-12',
    status: 'completed',
    method: 'Visa •••• 4242'
  },
  {
    id: 3,
    type: 'topup',
    amount: 100.00,
    description: 'Credits top-up via Mastercard ending in 5555',
    date: '2024-01-08',
    status: 'completed',
    method: 'Mastercard •••• 5555'
  },
  {
    id: 4,
    type: 'topup',
    amount: 25.00,
    description: 'Auto-refill via Visa ending in 4242',
    date: '2024-01-05',
    status: 'completed',
    method: 'Visa •••• 4242'
  }
];

export function TopupHistory() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg flex items-center">
          <History className="w-5 h-5 mr-2" />
          Recent Credit Top-ups
        </CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <ArrowUpCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <CreditCard className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {transaction.method}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">
                  +${transaction.amount.toFixed(2)}
                </p>
                <Badge 
                  variant="secondary" 
                  className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800 mt-1"
                >
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline" className="w-full">
            View All Transactions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}