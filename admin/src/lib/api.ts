import { axiosInstance } from "./axios.ts";


export const productApi = {
    getAll: async () => {
        const {data} = await axiosInstance.get("/admin/products");
        return data;
    },
    create: async (productData: any) => {
        const {data} = await axiosInstance.post("/admin/products", productData);
        return data;
    },
    update: async ({id, productData}: {id: string, productData: any}) => {
        const {data} = await axiosInstance.put(`/admin/products/${id}`, productData);
        return data;
    },
    delete: async (id: string) => {
        const {data} = await axiosInstance.delete(`/admin/products/${id}`);
        return data;
    }
}

export const orderApi = {
    getAll: async () => {
        const {data} = await axiosInstance.get("/admin/orders");
        return data;
    },
    getById: async (id: string) => {
        const {data} = await axiosInstance.get(`/admin/orders/${id}`);
        return data;
    },
    updateStatus: async ({id, status}: {id: string, status: string}) => {
        const {data} = await axiosInstance.patch(`/admin/orders/${id}/status`, {status});
        return data;
    }
}

export const userApi = {
    getAll: async () => {
        const {data} = await axiosInstance.get("/admin/users");
        return data;
    },
    getById: async (id: string) => {
        const {data} = await axiosInstance.get(`/admin/users/${id}`);
        return data;
    },
    updateRole: async ({id, role}: {id: string, role: string}) => {
        const {data} = await axiosInstance.put(`/admin/users/${id}`, {role});
        return data;
    },
    delete: async (id: string) => {
        const {data} = await axiosInstance.delete(`/admin/users/${id}`);
        return data;
    }
}
 
export const statsApi = {
    getDashboard: async () => {
        const {data} = await axiosInstance.get("/admin/stats");
        return data;
    }
}