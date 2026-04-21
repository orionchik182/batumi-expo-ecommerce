import { useQuery } from "@tanstack/react-query";
import { customersApi } from "src/lib/api";
import { formatDate } from "src/lib/utils";

function CustomersPage() {
  const {
    data: customersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
  });

  const customers = customersData?.customers || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-base-content/70 mt-1">
          {customers.length} {customers.length === 1 ? "customer" : "customers"}{" "}
          registered
        </p>
      </div>

      {/* Customers Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : error ? (
            <div className="text-error">Error loading customers</div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12 text-base-content/60">
              <p className="text-xl font-semibold mb-2">No customers found</p>
              <p className="text-sm">
                Customers will appear here once they sign up
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Addresses</th>
                    <th>Wishlist</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer: any) => (
                    <tr key={customer._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="w-12 rounded-full bg-primary text-primary-content">
                              <img
                                src={customer.imageUrl}
                                alt={customer.name}
                                className="size-12 rounded-full"
                              />
                            </div>
                          </div>
                          <div className="font-semibold">{customer.name}</div>
                        </div>
                      </td>
                      <td>{customer.email}</td>
                      <td>
                        <div className="badge badge-ghost">
                          {customer.addresses?.length || 0} address(es)
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-ghost">
                          {customer.wishlist?.length || 0} item(s)
                        </div>
                      </td>
                      <td>
                        <span className="text-sm opacity-60">
                          {formatDate(customer.createdAt)}
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
}

export default CustomersPage;
