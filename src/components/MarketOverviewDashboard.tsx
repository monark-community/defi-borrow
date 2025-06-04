
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, Shield } from "lucide-react";

export const MarketOverviewDashboard = () => {
  const marketData = {
    totalLiquidity: 2845000000,
    totalBorrowed: 1892000000,
    averageApy: 4.8,
    activeUsers: 45231
  };

  const topPools = [
    { asset: "USDC", supplied: 892000000, borrowed: 645000000, supplyApy: 3.2, borrowApy: 5.1, utilization: 72 },
    { asset: "ETH", supplied: 456000000, borrowed: 312000000, supplyApy: 2.8, borrowApy: 4.7, utilization: 68 },
    { asset: "DAI", supplied: 234000000, borrowed: 189000000, supplyApy: 3.5, borrowApy: 5.3, utilization: 81 },
    { asset: "WBTC", supplied: 123000000, borrowed: 87000000, supplyApy: 1.9, borrowApy: 3.8, utilization: 71 }
  ];

  const recentActivity = [
    { action: "Borrow", asset: "USDC", amount: 45000, time: "2 min ago", user: "0x1234...5678" },
    { action: "Supply", asset: "ETH", amount: 12.5, time: "5 min ago", user: "0xabcd...ef01" },
    { action: "Repay", asset: "DAI", amount: 8900, time: "8 min ago", user: "0x9876...5432" },
    { action: "Withdraw", asset: "USDC", amount: 15000, time: "12 min ago", user: "0xfedc...ba98" }
  ];

  return (
    <div className="space-y-6">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Liquidity</p>
                <p className="text-xl font-bold text-blue-600">
                  ${(marketData.totalLiquidity / 1000000000).toFixed(2)}B
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Borrowed</p>
                <p className="text-xl font-bold text-green-600">
                  ${(marketData.totalBorrowed / 1000000000).toFixed(2)}B
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Borrow APY</p>
                <p className="text-xl font-bold text-purple-600">{marketData.averageApy}%</p>
              </div>
              <TrendingDown className="w-5 h-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-xl font-bold text-orange-600">
                  {(marketData.activeUsers / 1000).toFixed(1)}K
                </p>
              </div>
              <Users className="w-5 h-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Lending Pools */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Top Lending Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPools.map((pool, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-lg text-gray-900">{pool.asset}</span>
                      <Badge variant="outline" className="text-xs">
                        {pool.utilization}% Utilized
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      ${(pool.supplied / 1000000).toFixed(0)}M supplied
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">Supply: {pool.supplyApy}%</p>
                    <p className="text-sm text-blue-600">Borrow: {pool.borrowApy}%</p>
                  </div>
                </div>
                <Progress value={pool.utilization} className="h-2 bg-gray-200" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-gray-900">
            <Clock className="w-5 h-5 mr-2" />
            Recent Market Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      activity.action === 'Borrow' ? 'text-blue-600 border-blue-200' :
                      activity.action === 'Supply' ? 'text-green-600 border-green-200' :
                      activity.action === 'Repay' ? 'text-purple-600 border-purple-200' :
                      'text-orange-600 border-orange-200'
                    }`}
                  >
                    {activity.action}
                  </Badge>
                  <span className="font-medium text-gray-900">{activity.asset}</span>
                  <span className="text-gray-600">
                    {typeof activity.amount === 'number' && activity.amount > 1000 
                      ? `$${activity.amount.toLocaleString()}` 
                      : `${activity.amount} ${activity.asset}`}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{activity.time}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
