import axios from 'axios';

// Proxy through Vite
const apiClient = axios.create({
    baseURL: '/api', // Same origin - Vite proxy handle karega
    timeout: 15000,
});

export const apiService = {
    async getHostels() {
        try {
            console.log('🚀 API Call through proxy...');
            const response = await apiClient.get('/hostels');
            console.log('✅ API Success:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ API Failed:', error);
            throw error;
        }
    },

    async getRooms() {
        try {
            const response = await apiClient.get('/rooms');
            return response.data;
        } catch (error) {
            console.error('Error fetching rooms:', error);
            throw error;
        }
    }
};

export default apiClient;