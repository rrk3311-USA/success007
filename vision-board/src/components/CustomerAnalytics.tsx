import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";

export default function CustomerAnalytics() {
  const metrics = [
    { label: "Total Customers", value: "1,234", change: "+12%", icon: Users, color: "text-blue-500" },
    { label: "Avg Order Value", value: "$45.67", change: "+8%", icon: DollarSign, color: "text-green-500" },
    { label: "Repeat Rate", value: "34%", change: "+5%", icon: TrendingUp, color: "text-purple-500" },
    { label: "Active Carts", value: "89", change: "-3%", icon: ShoppingCart, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <Card key={i} className="bg-slate-900/50 border-emerald-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900/50 border-emerald-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Customer Segments
          </CardTitle>
          <CardDescription>Revenue breakdown by customer type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "VIP Customers", count: 45, revenue: "$12,450", color: "bg-amber-500" },
              { name: "Loyal Customers", count: 234, revenue: "$28,900", color: "bg-blue-500" },
              { name: "Regular Customers", count: 567, revenue: "$18,750", color: "bg-green-500" },
              { name: "New Customers", count: 388, revenue: "$8,340", color: "bg-purple-500" },
            ].map((segment, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                  <div>
                    <p className="font-medium text-white">{segment.name}</p>
                    <p className="text-sm text-gray-400">{segment.count} customers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">{segment.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
