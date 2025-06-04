
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

const BORROW_ASSETS = [
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    apy: 5.2,
    available: 1000000,
    icon: DollarSign,
    color: "text-green-400"
  },
  {
    id: "dai",
    name: "Dai Stablecoin",
    symbol: "DAI",
    apy: 4.8,
    available: 500000,
    icon: DollarSign,
    color: "text-yellow-400"
  },
  {
    id: "usdt",
    name: "Tether USD",
    symbol: "USDT",
    apy: 5.5,
    available: 750000,
    icon: DollarSign,
    color: "text-blue-400"
  }
];

interface BorrowInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  maxBorrow: number;
  onBorrow: (amount: number) => void;
}

export const BorrowInterface = ({ isOpen, onClose, maxBorrow, onBorrow }: BorrowInterfaceProps) => {
  const [selectedAsset, setSelectedAsset] = useState(BORROW_ASSETS[0]);
  const [amount, setAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState([0]);
  const [interestType, setInterestType] = useState("variable");

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    setAmount((value[0] / 100) * maxBorrow);
  };

  const handleBorrow = () => {
    if (amount > 0) {
      onBorrow(amount);
    }
  };

  const dailyInterest = (amount * (selectedAsset.apy / 100)) / 365;
  const monthlyInterest = (amount * (selectedAsset.apy / 100)) / 12;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Borrow Assets</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Selection */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-3">Select Asset to Borrow</h3>
            <div className="grid grid-cols-3 gap-3">
              {BORROW_ASSETS.map((asset) => {
                const Icon = asset.icon;
                return (
                  <Card
                    key={asset.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedAsset.id === asset.id
                        ? "bg-blue-600/20 border-blue-500"
                        : "bg-slate-700 border-slate-600 hover:bg-slate-600"
                    }`}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${asset.color}`} />
                      <div className="font-medium">{asset.symbol}</div>
                      <div className="text-xs text-slate-400">{asset.apy}% APY</div>
                      <Badge variant="outline" className="mt-2 text-xs">
                        ${asset.available.toLocaleString()} Available
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Interest Rate Type */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-3">Interest Rate Type</h3>
            <Select value={interestType} onValueChange={setInterestType}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="variable">Variable Rate ({selectedAsset.apy}% APY)</SelectItem>
                <SelectItem value="fixed">Fixed Rate ({(selectedAsset.apy + 0.5).toFixed(1)}% APY)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-slate-400">Borrow Amount</h3>
              <span className="text-sm text-slate-400">
                Max: ${maxBorrow.toLocaleString()}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      const newAmount = Math.min(parseFloat(e.target.value) || 0, maxBorrow);
                      setAmount(newAmount);
                      setSliderValue([(newAmount / maxBorrow) * 100]);
                    }}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="0.0"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newAmount = maxBorrow * 0.25;
                      setAmount(newAmount);
                      setSliderValue([25]);
                    }}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    25%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newAmount = maxBorrow * 0.5;
                      setAmount(newAmount);
                      setSliderValue([50]);
                    }}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    50%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newAmount = maxBorrow * 0.75;
                      setAmount(newAmount);
                      setSliderValue([75]);
                    }}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    75%
                  </Button>
                </div>
              </div>

              <Slider
                value={sliderValue}
                onValueChange={handleSliderChange}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Summary */}
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Borrowing</span>
                    <span className="font-medium">${amount.toLocaleString()} {selectedAsset.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interest Rate</span>
                    <span className="text-blue-400">
                      {interestType === "variable" ? selectedAsset.apy : selectedAsset.apy + 0.5}% APY
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Daily Interest</span>
                    <span className="text-red-400">${dailyInterest.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Interest</span>
                    <span className="text-red-400">${monthlyInterest.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Health Factor</span>
                    <span className={amount > 0 ? "text-yellow-400" : "text-green-400"}>
                      {amount > 0 ? ((maxBorrow * 1.33) / amount).toFixed(2) : "∞"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loan Terms */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-300 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Loan Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-slate-400 space-y-1">
                  <p>• No fixed repayment schedule - repay anytime</p>
                  <p>• Interest accrues daily based on your borrowed amount</p>
                  <p>• Maintain health factor above 1.0 to avoid liquidation</p>
                  <p>• You can add more collateral or repay partial amounts</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button variant="outline" onClick={onClose} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
              Cancel
            </Button>
            <Button 
              onClick={handleBorrow}
              disabled={amount === 0 || amount > maxBorrow}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Borrow {selectedAsset.symbol}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
