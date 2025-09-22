import { useState, useEffect, useCallback } from "react";
import { Loader2, ChevronDown, ChevronUp, MoreHorizontal, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import EditOrderDialog from "@/components/dashboard/EditOrderDialog";
import { toast } from "sonner";
import { config } from "@/config";

interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  price_at_purchase: number;
  quantity: number;
}

export interface Order {
  id: string;
  order_ref?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}

const API_BASE_URL = config.API_URL; // Replace with your actual API base URL

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const getToken = () => localStorage.getItem("authToken");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch orders.");
      }
      const data = await response.json();
      setOrders(data);
      //toast.success("Orders fetched successfully.");
    } catch (error) {
      toast.error("Failed to fetch orders.");
      console.error("Error fetching orders: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDeleteOrder = async () => {
    if (!deleteOrderId) return;
    setIsUpdating(true);
    const token = getToken();
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${deleteOrderId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json",
           Authorization: `Bearer ${token}` },
        //body: JSON.stringify({ id: deleteOrderId }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete order.");
      }
      toast.success("Order deleted successfully.");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to delete order.");
      console.error("Error deleting order: ", error);
    } finally {
      setIsUpdating(false);
      setDeleteOrderId(null);
    }
  };

  const handleUpdateOrder = async (updatedFields: Partial<Order>) => {
    if (!editOrder) return;
    setIsUpdating(true);
     const token = getToken();
    try {
      // The update_order.php script expects 'order_ref', 'order_status', and 'payment_status'
      const payload = {
        order_ref: editOrder.order_ref,
        order_status: updatedFields.order_status,
        payment_status: updatedFields.payment_status,
      };

      const response = await fetch(`${API_BASE_URL}/orders/${payload.order_ref}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to update order.");
      }

      toast.success("Order updated successfully.");
      fetchOrders();
      setEditOrder(null);
    } catch (error) {
      toast.error("Failed to update order.");
      console.error("Error updating order: ", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="space-y-6 p-2 sm:p-2">
      <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block px-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Ref</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="w-[100px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <Loader2 className="inline-block animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <>
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.order_ref || order.id.substring(0, 8)}...</TableCell>
                        <TableCell>
                          {order.customer_name}<br />
                          <span className="text-xs text-gray-500">{order.customer_email}</span><br />
                          <span className="text-xs text-gray-500">{order.customer_phone}</span>
                        </TableCell>
                        <TableCell>{order.shipping_address}</TableCell>
                        <TableCell>Ksh {order.total_amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className="p-1" variant={order.order_status === "delivered" ? "default" : "secondary"}>
                            {order.order_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="p-1" variant={order.payment_status === "paid" ? "default" : "destructive"}>
                            {order.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => toggleExpand(order.id)}>
                            {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditOrder(order)}>Edit Order</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setDeleteOrderId(order.id)}>Delete Order</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      {expandedOrder === order.id && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-gray-50">
                            <div className="space-y-2">
                              <p className="font-semibold">Order Items</p>
                              <ul className="space-y-1">
                                {order.items.map((item) => (
                                  <li key={item.id} className="flex justify-between text-sm">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>Ksh {(item.price_at_purchase * item.quantity).toLocaleString()}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden p-4">
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-500">No orders found.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="rounded-xl border p-4 bg-gray-50 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold">#{order.order_ref || order.id.substring(0, 8)}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditOrder(order)}>Edit Order</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteOrderId( order.id)}>Delete Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{order.customer_name}</p>
                  <p className="text-xs text-gray-500 mb-2">{order.customer_email}</p>
                  <p className="text-xs text-gray-500 mb-2">{order.customer_phone}</p>
                  <p className="text-xs text-gray-800 mb-2">{order.shipping_address}</p>
                  <p className="text-sm font-semibold text-[#004d66]">Ksh {order.total_amount.toLocaleString()}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="font-medium">Order: </span>
                    <Badge className="p-1" variant={order.order_status === "delivered" ? "default" : "secondary"}>
                      {order.order_status}
                    </Badge>
                    <span className="font-medium">Payment: </span>
                    <Badge className="p-1" variant={order.payment_status === "paid" ? "default" : "destructive"}>
                      {order.payment_status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toggleExpand(order.id)}>
                    {expandedOrder === order.id ? "Hide Items" : "View Items"}
                  </Button>
                  {expandedOrder === order.id && (
                    <div className="mt-3 space-y-1 text-sm">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between border-b pb-1">
                          <span>{item.name} × {item.quantity}</span>
                          <span>Ksh {(item.price_at_purchase * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteOrderId} onOpenChange={(open) => !open && setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Order Dialog */}
      <EditOrderDialog
        order={editOrder}
        onClose={() => setEditOrder(null)}
        onUpdate={handleUpdateOrder}
        loading={isUpdating}
      />
    </div>
  );
}