import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "src/lib/api";
import { formatDate } from "src/lib/utils";
import type { Order, OrderItem } from "../../../shared/order.types";

function OrdersPage() {
  const queryClient = useQueryClient();

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const updateStatusMutation = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const orders = ordersData?.orders || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-base-content/70">Manage customer orders</p>
      </div>
      {/* Orders Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : error ? (
            <div className="text-error">Error loading orders</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-base-content/70">No orders found</p>
              <p className="text-sm">
                Orders will appear here once customers make purchases
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: Order) => {
                    const totalQuantity = order.orderItems.reduce(
                      (total: number, item: OrderItem) => total + item.quantity,
                      0,
                    );
                    return (
                      <tr key={order._id}>
                        <td>
                          <span className="font-medium">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div>
                            <div className="font-medium">
                              {order.shippingAddress?.fullName || "Unknown"}
                            </div>
                            <div className="text-sm opacity-60">
                              {order.shippingAddress?.city || "Unknown"},{" "}
                              {order.shippingAddress?.state || "Unknown"}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-sm opacity-60">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                        <td>
                          <div className="font-medium">
                            {totalQuantity} items
                          </div>
                          <div className="text-sm opacity-60">
                            {order.orderItems[0]?.name}
                            {order.orderItems.length > 1 &&
                              `+${order.orderItems.length - 1} more`}
                          </div>
                        </td>
                        <td>
                          <span className="font-semibold">
                            ${order.totalPrice.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <select
                            className="select select-sm"
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              handleStatusChange(order._id, "shipped")
                            }
                          >
                            Mark as Shipped
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
