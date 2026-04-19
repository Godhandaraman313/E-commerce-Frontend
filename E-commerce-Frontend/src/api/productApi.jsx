import axios from "axios";

const BASE_URL = "http://localhost:8282/api/products";

export const getProducts = () => axios.get(BASE_URL);

export const addProducts = (products) => {
  return axios.post(BASE_URL, products);
};
export const deleteProduct = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

export const updateProduct = (id, product) => {
  return axios.put(`${BASE_URL}/${id}`, product);
};