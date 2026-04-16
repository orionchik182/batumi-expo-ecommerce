import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "../lib/api.ts";
import {
  DollarSignIcon,
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";
import {
  capitalizeText,
  formatDate,
  getOrderStatusBadge,
} from "../lib/utils.ts";

const DashboardPage = () => {
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersErrorData,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getAll(),
  });
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: () => statsApi.getDashboard(),
  });

  const recentOrders = ordersData?.orders?.slice(0, 5) || [];

  const statsCards = [
    {
      name: "Total Revenue",
      value: statsLoading
        ? "..."
        : statsError
          ? "Error"
          : `$${statsData?.totalRevenue?.toFixed(2) || 0}`,
      icon: <DollarSignIcon className="size-8" />,
    },
    {
      name: "Total Orders",
      value: statsLoading
        ? "..."
        : statsError
          ? "Error"
          : `${statsData?.totalOrders || 0}`,
      icon: <ShoppingCartIcon className="size-8" />,
    },
    {
      name: "Total Customers",
      value: statsLoading
        ? "..."
        : statsError
          ? "Error"
          : `${statsData?.totalCustomers || 0}`,
      icon: <UsersIcon className="size-8" />,
    },
    {
      name: "Total Products",
      value: statsLoading
        ? "..."
        : statsError
          ? "Error"
          : `${statsData?.totalProducts || 0}`,
      icon: <PackageIcon className="size-8" />,
    },
  ];

  if (statsError && ordersError) {
    return <div className="text-error">Failed to load dashboard data</div>;
  }

  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 w-full">
      {statsCards.map((stat) => (
        <div className="stat" key={stat.name}>
          <div className="stat-figure text-secondary">{stat.icon}</div>
          <div className="stat-title">{stat.name}</div>
          <div className="stat-value">{stat.value}</div>
        </div>
      ))}

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Orders</h2>
          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : ordersError ? (
            <div className="card-title">
              Error fetching orders: {ordersErrorData?.message}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="card-title">No recent orders</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order._id}>
                      <td>
                        <span className="font-medium">
                          {order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="font-medium">
                          {order.shippingAddress.fullName}
                        </div>
                        <div className="text-sm opacity-60">
                          {order.orderItems.length} item(s)
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
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
                        <div
                          className={`badge ${getOrderStatusBadge(order.status)}`}
                        >
                          {capitalizeText(order.status)}
                        </div>
                      </td>
                      <td>
                        <span className="text-sm opacity-60">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
