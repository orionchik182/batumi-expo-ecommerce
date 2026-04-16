export const capitalizeText = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getOrderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
        case "pending":
            return "badge-warning";
        case "delivered":
            return "badge-success";
        case "shipped":
            return "badge-info";
        case "cancelled":
            return "badge-error";
        default:
            return "badge-ghost";
    }
};

export const getStockStatusBadge = (stock: number) => {
    if (stock === 0) {
        return {text: "Out of Stock", class: "badge-error"};
    }
    if (stock < 20) {
        return {text: "Low Stock", class: "badge-warning"};
    }
    return {text: "In Stock", class: "badge-success"};
};

export const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

