
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, Calendar, DollarSign, TrendingDown, Clock } from "lucide-react";

interface RepaymentTrackerProps {
  totalBorrowed: number;
  healthFactor: number;
  isModal?: boolean;
  onClose?: () => void;
  onRepay?: (amount: number) => void;
}

export const RepaymentTracker = ({ 
  totalBorrowed, 
  healthFactor, 
  isModal = false, 
  onClose, 
  onRepay 
}: RepaymentTrackerProps) => {
  const [repayAmount, setRepayAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState([0]);

  const dailyInterest = (totalBorrowed * 0.052) / 365; // 5.2% APY
  const accruedInterest = dailyInterest * 7; // 7 days of interest
  const totalOwed = totalBorrowed + accruedInterest;

  const borrowPositions = [
    {
      asset: "USDC",
      amount: totalBorrowed * 0.6,
      apy: 5.2,
      daysActive: 7,
      type: "Variable"
    },
    {
      asset: "DAI", 
      amount: totalBorrowed * 0.4,
      apy: 4.8,
      daysActive: 3,
      type: "Fixed"
    }
  ].filter(pos => pos.amount > 0);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    setRepayAmount((value[0] / 100) * totalOwed);
  };

  const handleRepay = () => {
    if (repayAmount > 0 && onRepay) {
      onRepay(repayAmount);
    }
  };

  const newHealthFactor = totalBorrowed > 0 
    ? (totalBorrowed * 1.33) / Math.max(1, totalBorrowed - repayAmount)
    : 999;

  const content = (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Borrowed</p>
                <p className="text-xl font-bold text-red-600">${totalBorrowed.toLocaleString()}</p>
              </div>
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accrued Interest</p>
                <p className="text-xl font-bold text-yellow-600">${accruedInterest.toFixed(2)}</p>
              </div>
              <TrendingDown className="w-5 h-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Daily Interest</p>
                <p className="text-xl font-bold text-orange-600">${dailyInterest.toFixed(2)}</p>
              </div>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Positions */}
      {borrowPositions.length > 0 && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Active Borrow Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {borrowPositions.map((position, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-lg text-gray-900">{position.asset}</span>
                        <Badge variant="outline" className="text-xs">
                          {position.type} Rate
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {position.daysActive} days active
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${position.amount.toLocaleString()}</p>
                      <p className="text-sm text-blue-600">{position.apy}% APY</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Interest Accrued</span>
                      <span className="text-yellow-600">
                        ${((position.amount * position.apy / 100 / 365) * position.daysActive).toFixed(2)}
                      </span>
                    </div>
                    <Progress 
                      value={(position.daysActive / 30) * 100} 
                      className="h-2 bg-gray-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Repayment Interface */}
      {isModal && totalBorrowed > 0 && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Repay Loan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Repayment Amount</span>
              <span className="text-sm text-gray-600">
                Total Owed: ${totalOwed.toLocaleString()}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={repayAmount}
                    onChange={(e) => {
                      const newAmount = Math.min(parseFloat(e.target.value) || 0, totalOwed);
                      setRepayAmount(newAmount);
                      setSliderValue([(newAmount / totalOwed) * 100]);
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
                      const newAmount = totalOwed * 0.25;
                      setRepayAmount(newAmount);
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
                      const newAmount = totalOwed * 0.5;
                      setRepayAmount(newAmount);
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
                      setRepayAmount(totalOwed);
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

            {/* Repayment Impact */}
            {repayAmount > 0 && (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Repaying</span>
                      <span className="font-medium text-gray-900">${repayAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining Debt</span>
                      <span className="text-red-600">${(totalOwed - repayAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New Health Factor</span>
                      <span className="text-green-600">
                        {newHealthFactor === 999 ? "∞" : newHealthFactor.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex space-x-4">
              <Button variant="outline" onClick={onClose} className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                Cancel
              </Button>
              <Button 
                onClick={handleRepay}
                disabled={repayAmount === 0}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Repay ${repayAmount.toLocaleString()}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interest Forecast */}
      {!isModal && totalBorrowed > 0 && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-gray-900">
              <Calendar className="w-5 h-5 mr-2" />
              Interest Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">7 Days</p>
                <p className="text-lg font-medium text-yellow-600">
                  ${(dailyInterest * 7).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">30 Days</p>
                <p className="text-lg font-medium text-orange-600">
                  ${(dailyInterest * 30).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">90 Days</p>
                <p className="text-lg font-medium text-red-600">
                  ${(dailyInterest * 90).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">1 Year</p>
                <p className="text-lg font-medium text-red-700">
                  ${(totalBorrowed * 0.052).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (isModal) {
    return (
      <Dialog open={isModal} onOpenChange={onClose}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Repay Loan</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">Repayment Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        {totalBorrowed > 0 ? content : (
          <div className="text-center py-8 text-gray-600">
            <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active loans</p>
            <p className="text-sm">Deposit collateral and borrow assets to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
