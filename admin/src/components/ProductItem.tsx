import { PencilIcon, TrashIcon } from "lucide-react";
import { memo } from "react";
import { getStockStatusBadge } from "src/lib/utils";

export const ProductItem = memo(
  ({
    product,
    onEdit,
    onDelete,
    isDeleting,
  }: {
    product: any;
    onEdit: (p: any) => void;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
  }) => {
    const status = getStockStatusBadge(product.stock);
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-6">
            <div className="avatar">
              <div className="w-20 rounded-xl">
                {product?.images?.length > 0 ? (
                  <img src={product?.images[0]} alt={product?.name} />
                ) : (
                  <div className="w-full h-full bg-base-200 flex items-center justify-center">
                    <span className="text-base-content/50">No Image</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="card-title">{product.name}</h3>
                  <p className="text-base-content/70 text-sm">
                    {product.category}
                  </p>
                </div>
                <span className={`badge ${status.class}`}>{status.text}</span>
              </div>
              <div className="flex items-center gap-6 mt-4">
                <div>
                  <p className="text-base-content/70 text-xs">Price</p>
                  <p className="text-lg font-bold">${product.price}</p>
                </div>
                <div>
                  <p className="text-base-content/70 text-xs">Stock</p>
                  <p className="text-lg font-bold">{product.stock} units</p>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <button
                className="btn btn-square btn-ghost"
                onClick={() => onEdit(product)}
              >
                <PencilIcon className="size-5" />
              </button>
              <button
                className="btn btn-square btn-ghost text-error"
                onClick={() => onDelete(product._id)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <TrashIcon className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
