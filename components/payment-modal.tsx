'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { 
  CreditCard, 
  Lock, 
  DollarSign,
  Check,
  X
} from 'lucide-react';

interface PaymentModalProps {
  onClose: () => void;
}

const PRESET_AMOUNTS = [
  { value: 10, label: '$10', popular: false },
  { value: 25, label: '$25', popular: true },
  { value: 50, label: '$50', popular: false },
  { value: 100, label: '$100', popular: false }
];

export function PaymentModal({ onClose }: PaymentModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [processing, setProcessing] = useState(false);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSelectedAmount(numValue);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : v;
  };

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing for demo
    setTimeout(() => {
      setProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Add Credits to Your Recipe Account</span>
          </DialogTitle>
          <DialogDescription>
            Add credits to unlock premium recipe features and enhanced functionality. All transactions are processed securely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Select Amount (USD)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PRESET_AMOUNTS.map((preset) => (
                <Card 
                  key={preset.value}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedAmount === preset.value && !customAmount 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleAmountSelect(preset.value)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="relative">
                      {preset.popular && (
                        <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs">
                          Popular
                        </Badge>
                      )}
                      <p className="text-lg font-semibold">{preset.label}</p>
                      {selectedAmount === preset.value && !customAmount && (
                        <Check className="w-5 h-5 text-primary mx-auto mt-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-amount">Custom Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount (10-500)"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="pl-10"
                  min="10"
                  max="500"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Minimum $10, Maximum $500
              </p>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="card" id="card" />
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="card" className="font-medium cursor-pointer">
                          Credit / Debit Card
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Visa, Mastercard, American Express
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Instant</Badge>
                  </div>
                </div>
              </Card>
            </RadioGroup>
          </div>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Card Information</Label>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({
                      ...cardDetails, 
                      number: formatCardNumber(e.target.value)
                    })}
                    maxLength={19}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        setCardDetails({...cardDetails, expiry: value});
                      }}
                      maxLength={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({
                        ...cardDetails, 
                        cvv: e.target.value.replace(/\D/g, '').substring(0, 4)
                      })}
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">Payment Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credits</span>
                <span className="font-medium">${selectedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium">$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-semibold text-lg">${selectedAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
            <Lock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">Secure Payment</p>
              <p className="text-xs text-green-600 dark:text-green-500">
                Your payment information is protected with 256-bit SSL encryption
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={processing}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              className="flex-1"
              disabled={processing || selectedAmount < 10 || selectedAmount > 500}
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add ${selectedAmount.toFixed(2)} Credits
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}