
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Bitcoin, Coins, DollarSign } from "lucide-react";

const COLLATERAL_ASSETS = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    price: 2400,
    ltv: 80,
    icon: DollarSign,
    color: "text-blue-500"
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    price: 65000,
    ltv: 75,
    icon: Bitcoin,
    color: "text-orange-500"
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    price: 1,
    ltv: 85,
    icon: Coins,
    color: "text-green-500"
  }
];

interface CollateralDepositProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

export const CollateralDeposit = ({ isOpen, onClose, onDeposit }: CollateralDepositProps) => {
  const [selectedAsset, setSelectedAsset] = useState(COLLATERAL_ASSETS[0]);
  const [amount, setAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState([0]);

  const maxAmount = 10; // Simulated wallet balance
  const usdValue = amount * selectedAsset.price;

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    setAmount((value[0] / 100) * maxAmount);
  };

  const handleDeposit = () => {
    if (amount > 0) {
      onDeposit(usdValue);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Deposit Collateral</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">Select Collateral Asset</h3>
            <div className="grid grid-cols-3 gap-3">
              {COLLATERAL_ASSETS.map((asset) => {
                const Icon = asset.icon;
                return (
                  <Card
                    key={asset.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedAsset.id === asset.id
                        ? "bg-blue-50 border-blue-300"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${asset.color}`} />
                      <div className="font-medium text-gray-900">{asset.symbol}</div>
                      <div className="text-xs text-gray-600">${asset.price.toLocaleString()}</div>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {asset.ltv}% LTV
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-600">Deposit Amount</h3>
              <span className="text-sm text-gray-600">
                Balance: {maxAmount} {selectedAsset.symbol}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      const newAmount = Math.min(parseFloat(e.target.value) || 0, maxAmount);
                      setAmount(newAmount);
                      setSliderValue([(newAmount / maxAmount) * 100]);
                    }}
                    className="bg-white border-gray-300 text-gray-900"
                    placeholder="0.0"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newAmount = maxAmount * 0.25;
                      setAmount(newAmount);
                      setSliderValue([25]);
                    }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    25%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newAmount = maxAmount * 0.5;
                      setAmount(newAmount);
                      setSliderValue([50]);
                    }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    50%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAmount(maxAmount);
                      setSliderValue([100]);
                    }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    MAX
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
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Depositing</span>
                    <span className="text-gray-900">{amount.toFixed(4)} {selectedAsset.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">USD Value</span>
                    <span className="font-medium text-gray-900">${usdValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Borrow (75%)</span>
                    <span className="text-green-600">${(usdValue * 0.75).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Liquidation LTV</span>
                    <span className="text-orange-600">{selectedAsset.ltv}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button variant="outline" onClick={onClose} className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </Button>
            <Button 
              onClick={handleDeposit}
              disabled={amount === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Deposit Collateral
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
