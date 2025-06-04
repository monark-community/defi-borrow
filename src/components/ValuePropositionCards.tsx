
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, TrendingUp, Users } from "lucide-react";

export const ValuePropositionCards = () => {
  const propositions = [
    {
      icon: Shield,
      title: "Secure & Audited",
      description: "Smart contracts audited by top security firms with $2.8B+ locked safely",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Zap,
      title: "Instant Lending",
      description: "Borrow assets instantly with no credit checks or lengthy approval processes",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: TrendingUp,
      title: "Competitive Rates",
      description: "Market-leading interest rates with real-time optimization algorithms",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-4">
      {propositions.map((prop, index) => (
        <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg ${prop.bgColor} flex items-center justify-center flex-shrink-0`}>
                <prop.icon className={`w-5 h-5 ${prop.color}`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">{prop.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{prop.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
