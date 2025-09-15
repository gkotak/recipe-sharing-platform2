'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { PaymentModal } from './payment-modal';
import { TopupHistory } from './topup-history';
import { UsageOverview } from './usage-overview';
import { 
  Wallet, 
  CreditCard, 
  Settings, 
  Plus, 
  TrendingUp, 
  DollarSign,
  User,
  Bell,
  ChevronDown
} from 'lucide-react';

export function PaymentDashboard() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [balance] = useState(47.85);
  const [autoRefill, setAutoRefill] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-medium text-foreground truncate">Payment Center</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Manage your recipe platform credits</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Balance Overview */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-0">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-sm text-muted-foreground mb-1">Current Credits</p>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">${balance.toFixed(2)}</h2>
                  </div>
                  <div className="flex items-center space-x-2">

                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button 
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Credits
                  </Button>
                  <Button variant="outline">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Payment Methods</span>
                    <span className="sm:hidden">Methods</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Usage Overview */}
            <UsageOverview />

            {/* Transaction History */}
            <TopupHistory />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">This Month</p>
                      <p className="text-xs text-muted-foreground">Recipe uploads</p>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground text-sm sm:text-base">$5.50</p>
                </div>

                <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Last Top-up</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground text-sm sm:text-base">$50.00</p>
                </div>

                <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Avg. Monthly</p>
                      <p className="text-xs text-muted-foreground">Usage pattern</p>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground text-sm sm:text-base">$15.20</p>
                </div>
              </CardContent>
            </Card>

            {/* Auto-Refill Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Auto-Refill
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start sm:items-center justify-between">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-medium">Enable Auto-Refill</p>
                    <p className="text-xs text-muted-foreground">When balance drops below $5</p>
                  </div>
                  <Switch 
                    checked={autoRefill} 
                    onCheckedChange={setAutoRefill}
                    className="flex-shrink-0"
                  />
                </div>
                
                {autoRefill && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Refill Amount</span>
                        <Badge variant="outline">$25.00</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Trigger Point</span>
                        <Badge variant="outline">$5.00</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Payment Method</span>
                        <Badge variant="outline">•••• 4242</Badge>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Credit Usage Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Credit Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Recipe Upload</span>
                  <Badge variant="secondary" className="text-xs">$0.50</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Premium Features</span>
                  <Badge variant="secondary" className="text-xs">$2.00/month</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Minimum Top-up</span>
                  <Badge variant="secondary" className="text-xs">$10.00</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)} />
      )}
    </div>
  );
}