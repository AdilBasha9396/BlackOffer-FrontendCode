import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/data'; // Ensure this URL matches your backend API

export const getData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
