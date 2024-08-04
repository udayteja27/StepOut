import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const signup = (data) => axios.post(`${API_URL}/auth/signup`, data);
export const login = (data) => axios.post(`${API_URL}/auth/login`, data);
export const addTrain = (data, token) => axios.post(`${API_URL}/trains`, data, { headers: { Authorization: `Bearer ${token}` } });
export const getTrains = (params) => axios.get(`${API_URL}/trains`, { params });
export const bookSeat = (train_id, data, token) => axios.post(`${API_URL}/bookings/${train_id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const getBookingDetails = (booking_id, token) => axios.get(`${API_URL}/bookings/${booking_id}`, { headers: { Authorization: `Bearer ${token}` } });
