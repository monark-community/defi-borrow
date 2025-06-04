
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, AlertCircle } from "lucide-react";

interface HealthFactorProps {
  healthFactor: number;
  totalCollateral: number;
  totalBorrowed: number;
}

export const HealthFactor = ({ healthFactor, totalCollateral, totalBorrowed }: HealthFactorProps) => {
  const getHealthStatus = () => {
    if (healthFactor > 2) return { 
      status: "Healthy", 
      color: "bg-green-500", 
      textColor: "text-green-400",
      description: "Your position is well-collateralized",
      icon: Shield
    };
    if (healthFactor > 1.5) return { 
      status: "Moderate", 
      color: "bg-yellow-500", 
      textColor: "text-yellow-400",
      description: "Consider adding more collateral",
      icon: AlertTriangle
    };
    if (healthFactor > 1.1) return { 
      status: "Risky", 
      color: "bg-orange-500", 
      textColor: "text-orange-400",
      description: "High risk of liquidation",
      icon: AlertCircle
    };
    return { 
      status: "Liquidation Risk", 
      color: "bg-red-500", 
      textColor: "text-red-400",
      description: "Immediate action required",
      icon: AlertCircle
    };
  };

  const healthStatus = getHealthStatus();
  const Icon = healthStatus.icon;
  
  // Calculate progress bar value (invert scale for visual appeal)
  const progressValue = Math.min(100, Math.max(0, (healthFactor / 3) * 100));
  
  const liquidationPrice = totalBorrowed > 0 ? (totalBorrowed / 0.8) : 0;
  const liquidationBuffer = totalCollateral - liquidationPrice;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Icon className={`w-5 h-5 mr-2 ${healthStatus.textColor}`} />
          Health Factor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Factor Display */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${healthStatus.textColor} mb-2`}>
            {healthFactor === 999 ? "∞" : healthFactor.toFixed(2)}
          </div>
          <Badge variant="outline" className={`${healthStatus.color} border-0 text-white mb-2`}>
            {healthStatus.status}
          </Badge>
          <p className="text-sm text-slate-400">{healthStatus.description}</p>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Risk Level</span>
            <span className={healthStatus.textColor}>{healthStatus.status}</span>
          </div>
          <Progress 
            value={progressValue} 
            className={`h-3 bg-slate-700 ${
              healthFactor > 2 ? '[&>div]:bg-green-500' :
              healthFactor > 1.5 ? '[&>div]:bg-yellow-500' :
              healthFactor > 1.1 ? '[&>div]:bg-orange-500' :
              '[&>div]:bg-red-500'
            }`}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>High Risk</span>
            <span>Low Risk</span>
          </div>
        </div>

        {/* Health Factor Breakdown */}
        <div className="space-y-3 pt-2 border-t border-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-400">Collateral Value</span>
            <span className="text-green-400">${totalCollateral.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Borrowed Amount</span>
            <span className="text-red-400">${totalBorrowed.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Liquidation Threshold</span>
            <span className="text-orange-400">${liquidationPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Safety Buffer</span>
            <span className={liquidationBuffer > 0 ? "text-green-400" : "text-red-400"}>
              ${liquidationBuffer.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Risk Alerts */}
        {healthFactor < 1.5 && healthFactor !== 999 && (
          <Alert className="border-orange-500 bg-orange-500/10">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-200">
              {healthFactor < 1.1 
                ? "Critical: Add collateral immediately to avoid liquidation"
                : "Warning: Consider adding more collateral or repaying part of your loan"
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Health Factor Explanation */}
        <div className="bg-slate-700/50 rounded-lg p-3 mt-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Understanding Health Factor</h4>
          <div className="text-xs text-slate-400 space-y-1">
            <p>• Health Factor = (Collateral × 0.8) / Borrowed Amount</p>
            <p>• Values above 1.0 are safe from liquidation</p>
            <p>• Below 1.0 triggers automatic liquidation</p>
            <p>• Higher values indicate safer positions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
