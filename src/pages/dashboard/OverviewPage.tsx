// src/pages/dashboard/OverviewPage.tsx
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { config } from "@/config";

interface RevenueItem {
  date: string;
  revenue: number;
}

interface OverviewData {
  newOrdersCount: number;
  totalProductsCount: number;
  lowStockCount: number;
  revenueData: RevenueItem[];
}

export default function OverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

    const getToken = () => {
    // Retrieves the auth token from localStorage.
    return localStorage.getItem("authToken");
  };

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${config.API_URL}/dashboard/overview.php`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        setData(result);
      } catch (err) {
        console.error("Error loading overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#004d66] mb-2" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">Overview</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>New Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-[#004d66]">
              {data.newOrdersCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-[#004d66]">
              {data.totalProductsCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock (≤3)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">
              {data.lowStockCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-[#004d66]">
              Ksh{" "}
              {data.revenueData
                .reduce((sum, item) => sum + Number(item.revenue), 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Revenue (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.revenueData}
              margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
                angle={window.innerWidth < 640 ? -45 : 0}
                textAnchor={window.innerWidth < 640 ? "end" : "middle"}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                labelStyle={{ color: "#004d66" }}
              />
              <Bar
                dataKey="revenue"
                fill="#004d66"
                radius={[6, 6, 0, 0]}
                barSize={window.innerWidth < 640 ? 20 : 35}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
