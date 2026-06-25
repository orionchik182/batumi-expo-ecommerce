export const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "#10B981";
    case "shipped":
      return "#3B82F6";
    case "pending":
      return "#F59E0B";
    default:
      return "#666666";
  }
};
