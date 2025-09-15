// src/components/dashboard/EditOrderDialog.tsx

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/pages/dashboard/OrdersPage";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditOrderDialogProps {
  order: Order | null;
  onClose: () => void;
  onUpdate: (updatedOrder: Partial<Order>) => void;
  loading: boolean;
}

const EditOrderDialog: React.FC<EditOrderDialogProps> = ({ order, onClose, onUpdate, loading }) => {
  const [orderStatus, setOrderStatus] = useState(order?.order_status || "");
  const [paymentStatus, setPaymentStatus] = useState(order?.payment_status || "");

  useEffect(() => {
    if (order) {
      setOrderStatus(order.order_status);
      setPaymentStatus(order.payment_status);
    }
  }, [order]);

  const handleUpdate = async () => {
    if (!order) return;
    onUpdate({
      order_ref: order.order_ref,
      order_status: orderStatus,
      payment_status: paymentStatus,
    });
  };

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>
            Update the order and payment status for order #{order?.order_ref || order?.id.substring(0, 8)}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="order-status" className="text-right">
              Order Status
            </Label>
            <Select onValueChange={setOrderStatus} value={orderStatus}>
              <SelectTrigger id="order-status" className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment-status" className="text-right">
              Payment Status
            </Label>
            <Select onValueChange={setPaymentStatus} value={paymentStatus}>
              <SelectTrigger id="payment-status" className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;
