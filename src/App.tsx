import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Users, Box, LogOut } from "lucide-react"

function AdminApp() {
  const [search, setSearch] = useState("")

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="px-6 py-4 text-2xl font-bold text-indigo-600">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Button variant="ghost" className="justify-start w-full">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Products
          </Button>
          <Button variant="ghost" className="justify-start w-full">
            <Users className="mr-2 h-4 w-4" />
            Customers
          </Button>
          <Button variant="ghost" className="justify-start w-full">
            <Box className="mr-2 h-4 w-4" />
            Orders
          </Button>
        </nav>
        <div className="px-4 py-4 border-t">
          <Button variant="ghost" className="justify-start w-full text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Navbar */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">120</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">45</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">78</p>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4">Order ID</th>
                  <th className="py-2 px-4">Customer</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {["001", "002", "003"].map((id) => (
                  <tr key={id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{id}</td>
                    <td className="py-2 px-4">Customer {id}</td>
                    <td className="py-2 px-4">Pending</td>
                    <td className="py-2 px-4">$100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default AdminApp
