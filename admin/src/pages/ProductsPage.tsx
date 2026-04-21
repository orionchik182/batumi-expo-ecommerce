import { useQuery } from "@tanstack/react-query";

import { productApi } from "../lib/api.ts";

import { useProductForm } from "src/hooks/useProductForm.ts";
import { Toaster } from "react-hot-toast";
import { PlusIcon } from "lucide-react";
import { ProductItem } from "src/components/ProductItem.tsx";

import ProductModal from "src/components/ProductModal.tsx";

function ProductsPage() {
  const formProps = useProductForm();
  const {
    showModal,
    setShowModal,
    openEditModal,
    handleDeleteProduct,
    deletingProductId,
  } = formProps;

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
    select: (data: any) => data.products,
  });

  return (
    <div className="space-y-6">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-base-content/70 mt-1">
            Manage your product inventory
          </p>
        </div>
        <button
          className="btn btn-primary gap-2"
          onClick={() => setShowModal(true)}
        >
          <PlusIcon className="size-5" />
          Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : error ? (
          <div className="card-title">
            Error fetching products: {error.message}
          </div>
        ) : products?.length === 0 ? (
          <div className="card-title">No products found</div>
        ) : (
          products?.map((product: any) => (
            <ProductItem
              key={product._id}
              product={product}
              onEdit={openEditModal}
              onDelete={handleDeleteProduct}
              isDeleting={deletingProductId === product._id}
            />
          ))
        )}
      </div>

      {/*ADD/EDIT Modal */}
      <input
        type="checkbox"
        id="product-modal"
        className="modal-toggle"
        checked={showModal}
        onChange={(e) => setShowModal(e.target.checked)}
      />
      <ProductModal {...formProps} />
    </div>
  );
}

export default ProductsPage;
