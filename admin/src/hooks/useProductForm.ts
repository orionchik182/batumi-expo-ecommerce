import { useState, useCallback } from "react";
import type { Product, ImageItem } from "@shared/product.types";
import { useProductMutations } from "./useProductMutations";

export function useProductForm() {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
    });
    imageItems.forEach((item) => {
      if (item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
    });
    setImageItems([]);
  }, [imageItems]);

  const { deleteMutation, createMutation, updateMutation } =
    useProductMutations(closeModal);

  const openEditModal = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
    });
    setImageItems(product.images.map((url) => ({ id: url, url, file: null })));
    setShowModal(true);
  }, []);

  const getFormData = () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("description", formData.description);

    imageItems.forEach((item) => {
      if (item.file) {
        data.append("images", item.file);
        data.append("imagePositions", "new");
      } else {
        data.append("existingImages", item.url);
        data.append("imagePositions", "existing");
      }
    });
    return data;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageItems.length + files.length > 3) {
      alert("You can only have up to 3 images total");
      return;
    }
    const newItems = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      file,
    }));
    setImageItems([...imageItems, ...newItems]);
    e.target.value = ""; // reset input
  };

  const handleRemoveImage = (id: string) => {
    setImageItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);
      if (itemToRemove?.url.startsWith("blob:")) {
        URL.revokeObjectURL(itemToRemove.url);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleDeleteProduct = useCallback(
    (id: string) => {
      if (confirm("Are you sure you want to delete this product?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation],
  );

  const onPageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct && imageItems.length === 0) {
      alert("Please upload at least one image");
      return;
    }
    const data = getFormData();

    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct._id,
        productData: data,
      });
    } else {
      createMutation.mutate(data);
      
    }
  };

  return {
    showModal,
    setShowModal,
    editingProduct,
    formData,
    setFormData,
    imageItems,
    setImageItems,
    closeModal,
    openEditModal,
    getFormData,
    handleImageChange,
    handleDeleteProduct,
    onPageSubmit,
    handleRemoveImage,
    isPending: createMutation.isPending || updateMutation.isPending,
    deletingProductId: deleteMutation.isPending
      ? deleteMutation.variables
      : null,
  };
}
