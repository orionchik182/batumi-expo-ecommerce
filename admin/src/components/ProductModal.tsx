import { closestCenter, DndContext } from "@dnd-kit/core";
import { XIcon } from "lucide-react";
import { useImageDnd } from "src/hooks/useImageDnd";
import { useProductForm } from "src/hooks/useProductForm";

import { SortableImage } from "./SortableImage";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

function ProductModal(props: ReturnType<typeof useProductForm>) {
  const {
    editingProduct,
    setShowModal,
    onPageSubmit,
    formData,
    setFormData,
    handleImageChange,
    imageItems,
    handleRemoveImage,
    closeModal,
    setImageItems,
    isPending,
  } = props;

  const { sensors, handleDragEnd } = useImageDnd(imageItems, setImageItems);

  return (
    <div className="modal">
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-2xl">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => setShowModal(false)}
          >
            <XIcon className="size-5" />
          </button>
        </div>
        <form onSubmit={onPageSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span>Product Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span>Category</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="select select-bordered"
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Fashion">Fashion</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span>Price ($)</span>
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Stock</span>
              </label>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="input input-bordered"
                required
              />
            </div>
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span>Description</span>
            </label>
            <textarea
              value={formData.description}
              placeholder="Enter product description"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="textarea textarea-bordered w-full h-24"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-base flex items-center gap-2">
                Product Images
              </span>
              <span className="label-text-alt text-xs opacity-60">
                Max 3 images
              </span>
            </label>
            <div className="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300 hover:border-primary transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered file-input-primary w-full"
                required={!editingProduct && imageItems.length === 0}
              />
              {editingProduct && (
                <p className="text-xs text-base-content/60 mt-2 text-center">
                  Drag and drop to reorder. First picture will be the main one.
                </p>
              )}
            </div>
            {imageItems.length > 0 && (
              <div className="mt-4">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={imageItems.map((i) => i.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {imageItems.map((item, index) => (
                        <SortableImage
                          key={item.id}
                          item={item}
                          index={index}
                          handleRemoveImage={handleRemoveImage}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 modal-action">
            <button
              type="button"
              className="btn"
              onClick={closeModal}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner"></span>
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
