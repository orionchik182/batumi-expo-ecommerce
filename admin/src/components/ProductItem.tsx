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
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="avatar flex-shrink-0">
              <div className="w-20 rounded-xl">
                {product?.images?.length > 0 ? (
                  <img src={product?.images[0]} alt={product?.name} className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-base-200 flex items-center justify-center">
                    <span className="text-base-content/50 text-xs">No Image</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0">
                <div className="min-w-0 pr-2">
                  <h3 className="card-title text-base sm:text-lg truncate">{product.name}</h3>
                  <p className="text-base-content/70 text-sm">
                    {product.category}
                  </p>
                </div>
                <span className={`badge ${status.class} whitespace-nowrap self-start`}>{status.text}</span>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-4">
                <div>
                  <p className="text-base-content/70 text-xs">Price</p>
                  <p className="text-base sm:text-lg font-bold">${product.price}</p>
                </div>
                <div>
                  <p className="text-base-content/70 text-xs">Stock</p>
                  <p className="text-base sm:text-lg font-bold">{product.stock} units</p>
                </div>
              </div>
            </div>
            <div className="card-actions flex-row sm:flex-col justify-end mt-4 sm:mt-0">
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
