import type { Product } from "../../shared/product.types";

export const filterProducts = (
  products: Product[],
  searchQuery: string,
  selectedCategory: string,
) => {
  if (!Array.isArray(products)) return [];

  const normalizedSearch = searchQuery.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      normalizedSearch === "" ||
      product.name?.toLowerCase().includes(normalizedSearch);

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
};
