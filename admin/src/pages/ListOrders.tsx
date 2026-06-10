import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../lib/api";

interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

interface Order {
  _id: string;
  userId: OrderUser;
  items: Record<string, Record<string, number>>;
  amount: number;
  address: string;
  status: string;
  payment_mode: string;
  date: string;
}

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

const ListOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data.orders ?? []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      await fetchOrders();
    } catch {
      toast.error("Failed to update order status");
    }
  };

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="flex flex-wrap justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {order.userId?.name ?? "Unknown"} ({order.userId?.email ?? "—"})
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleString()} · {order.payment_mode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₹{order.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{order.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListOrders;
