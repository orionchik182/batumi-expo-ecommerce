export const MENU_ITEMS = [
    {
        id: 1,
        icon: "person-outline",
        title: "Edit Profile",
        color: "#3B82F6",
        action: "/profile"
    },
    {
        id: 2,
        icon: "list-outline",
        title: "Orders",
        color: "#10B981",
        action: "/orders"
    },
    {
        id: 3,
        icon: "location-outline",
        title: "Addresses",
        color: "#F59E0B",
        action: "/addresses"
    },
    {
        id: 4,
        icon: "heart-outline",
        title: "Wishlist",
        color: "#EF4444",
        action: "/wishlist"
    }
] as const;