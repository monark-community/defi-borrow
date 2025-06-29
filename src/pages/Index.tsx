
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  Shield, 
  DollarSign, 
  AlertTriangle,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Users,
  Clock
} from "lucide-react";
import { CollateralDeposit } from "@/components/CollateralDeposit";
import { BorrowInterface } from "@/components/BorrowInterface";
import { RepaymentTracker } from "@/components/RepaymentTracker";
import { HealthFactor } from "@/components/HealthFactor";
import { MarketOverviewDashboard } from "@/components/MarketOverviewDashboard";
import { ValuePropositionCards } from "@/components/ValuePropositionCards";

const Index = () => {
  const [totalCollateral, setTotalCollateral] = useState(0);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [healthFactor, setHealthFactor] = useState(2.5);
  const [showCollateralModal, setShowCollateralModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Market data for when wallet is not connected
  const marketStats = {
    totalLiquidity: 2845000000,
    totalBorrowed: 1892000000,
    averageSupplyApy: 3.2,
    averageBorrowApy: 4.8
  };

  const calculateHealthFactor = () => {
    if (totalBorrowed === 0) return 999;
    return (totalCollateral * 0.8) / totalBorrowed; // 80% liquidation threshold
  };

  useEffect(() => {
    setHealthFactor(calculateHealthFactor());
  }, [totalCollateral, totalBorrowed]);

  const getHealthStatus = () => {
    if (healthFactor > 2) return { status: "Healthy", color: "bg-green-500", textColor: "text-green-600" };
    if (healthFactor > 1.5) return { status: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-600" };
    if (healthFactor > 1.1) return { status: "Risky", color: "bg-orange-500", textColor: "text-orange-600" };
    return { status: "Liquidation Risk", color: "bg-red-500", textColor: "text-red-600" };
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BorrowX
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsWalletConnected(!isWalletConnected)}
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isWalletConnected ? "Disconnect Wallet" : "Connect Wallet"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Health Factor Alert */}
        {isWalletConnected && healthFactor < 1.5 && (
          <Alert className="mb-6 border-orange-500 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Warning: Your health factor is {healthFactor.toFixed(2)}. Consider adding more collateral or repaying part of your loan.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {isWalletConnected ? (
            <>
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Collateral</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">${totalCollateral.toLocaleString()}</span>
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Borrowed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-600">${totalBorrowed.toLocaleString()}</span>
                    <ArrowDownRight className="w-5 h-5 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Available to Borrow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      ${Math.max(0, (totalCollateral * 0.75) - totalBorrowed).toLocaleString()}
                    </span>
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Health Factor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${getHealthStatus().textColor}`}>
                      {healthFactor === 999 ? "∞" : healthFactor.toFixed(2)}
                    </span>
                    <Badge variant="outline" className={`${getHealthStatus().color} border-0 text-white`}>
                      {getHealthStatus().status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Market Liquidity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      ${(marketStats.totalLiquidity / 1000000000).toFixed(2)}B
                    </span>
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Borrowed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      ${(marketStats.totalBorrowed / 1000000000).toFixed(2)}B
                    </span>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Best Supply APY</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">{marketStats.averageSupplyApy}%</span>
                    <ArrowUpRight className="w-5 h-5 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">45.2K</span>
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => setShowCollateralModal(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={!isWalletConnected}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Deposit Collateral
                </Button>
                <Button 
                  onClick={() => setShowBorrowModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!isWalletConnected || totalCollateral === 0}
                >
                  <ArrowDownRight className="w-4 h-4 mr-2" />
                  Borrow Assets
                </Button>
                <Button 
                  onClick={() => setShowRepayModal(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!isWalletConnected || totalBorrowed === 0}
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Repay Loan
                </Button>
              </CardContent>
            </Card>

            {/* Value Proposition Cards (only when wallet not connected) */}
            {!isWalletConnected && (
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Why Choose BorrowX?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ValuePropositionCards />
                </CardContent>
              </Card>
            )}

            {/* Health Factor Component (only when wallet connected) */}
            {isWalletConnected && (
              <HealthFactor 
                healthFactor={healthFactor}
                totalCollateral={totalCollateral}
                totalBorrowed={totalBorrowed}
              />
            )}
          </div>

          {/* Right Columns - Position Details & Repayment or Market Overview */}
          <div className="lg:col-span-2">
            {isWalletConnected ? (
              <RepaymentTracker 
                totalBorrowed={totalBorrowed}
                healthFactor={healthFactor}
              />
            ) : (
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Market Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarketOverviewDashboard />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCollateralModal && (
        <CollateralDeposit
          isOpen={showCollateralModal}
          onClose={() => setShowCollateralModal(false)}
          onDeposit={(amount) => {
            setTotalCollateral(prev => prev + amount);
            setShowCollateralModal(false);
          }}
        />
      )}

      {showBorrowModal && (
        <BorrowInterface
          isOpen={showBorrowModal}
          onClose={() => setShowBorrowModal(false)}
          maxBorrow={(totalCollateral * 0.75) - totalBorrowed}
          onBorrow={(amount) => {
            setTotalBorrowed(prev => prev + amount);
            setShowBorrowModal(false);
          }}
        />
      )}

      {showRepayModal && (
        <RepaymentTracker
          totalBorrowed={totalBorrowed}
          healthFactor={healthFactor}
          isModal={true}
          onClose={() => setShowRepayModal(false)}
          onRepay={(amount) => {
            setTotalBorrowed(prev => Math.max(0, prev - amount));
            setShowRepayModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Index;
