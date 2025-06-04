
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
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Borrowed</p>
                <p className="text-xl font-bold text-red-400">${totalBorrowed.toLocaleString()}</p>
              </div>
              <DollarSign className="w-5 h-5 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Accrued Interest</p>
                <p className="text-xl font-bold text-yellow-400">${accruedInterest.toFixed(2)}</p>
              </div>
              <TrendingDown className="w-5 h-5 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Daily Interest</p>
                <p className="text-xl font-bold text-orange-400">${dailyInterest.toFixed(2)}</p>
              </div>
              <Clock className="w-5 h-5 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Positions */}
      {borrowPositions.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Active Borrow Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {borrowPositions.map((position, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-lg">{position.asset}</span>
                        <Badge variant="outline" className="text-xs">
                          {position.type} Rate
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">
                        {position.daysActive} days active
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${position.amount.toLocaleString()}</p>
                      <p className="text-sm text-blue-400">{position.apy}% APY</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Interest Accrued</span>
                      <span className="text-yellow-400">
                        ${((position.amount * position.apy / 100 / 365) * position.daysActive).toFixed(2)}
                      </span>
                    </div>
                    <Progress 
                      value={(position.daysActive / 30) * 100} 
                      className="h-2 bg-slate-600"
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
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Repay Loan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Repayment Amount</span>
              <span className="text-sm text-slate-400">
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
                    className="bg-slate-700 border-slate-600 text-white"
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
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
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
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
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
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
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
              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Repaying</span>
                      <span className="font-medium">${repayAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Remaining Debt</span>
                      <span className="text-red-400">${(totalOwed - repayAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">New Health Factor</span>
                      <span className="text-green-400">
                        {newHealthFactor === 999 ? "∞" : newHealthFactor.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex space-x-4">
              <Button variant="outline" onClick={onClose} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                Cancel
              </Button>
              <Button 
                onClick={handleRepay}
                disabled={repayAmount === 0}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Repay ${repayAmount.toLocaleString()}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interest Forecast */}
      {!isModal && totalBorrowed > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Interest Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-slate-400">7 Days</p>
                <p className="text-lg font-medium text-yellow-400">
                  ${(dailyInterest * 7).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400">30 Days</p>
                <p className="text-lg font-medium text-orange-400">
                  ${(dailyInterest * 30).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400">90 Days</p>
                <p className="text-lg font-medium text-red-400">
                  ${(dailyInterest * 90).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400">1 Year</p>
                <p className="text-lg font-medium text-red-500">
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
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Repay Loan</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg">Repayment Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        {totalBorrowed > 0 ? content : (
          <div className="text-center py-8 text-slate-400">
            <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active loans</p>
            <p className="text-sm">Deposit collateral and borrow assets to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
