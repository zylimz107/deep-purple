import axios from "axios";

// const API_BASE_URL = "https://purpleproj.click/emotion";
// const API_MOD_URL = "https://purpleproj.click/models";
// const API_COM_URL = "https://purpleproj.click/communication";

const API_BASE_URL = "http://localhost:8080/emotion";
const API_MOD_URL = "http://localhost:8080/models";
const API_COM_URL = "http://localhost:8080/communication";
// Category Functions
export const createCategory = (modelId, name) =>
  axios.post(`${API_BASE_URL}/category`, null, { params: { modelId, name } });

export const getCategoriesByModel = (modelId) =>
  axios.get(`${API_BASE_URL}/category`, { params: { modelId } });

export const updateCategory = (id, name) =>
  axios.put(`${API_BASE_URL}/category/${id}`, null, { params: { name } });

export const deleteCategory = (id) =>
  axios.delete(`${API_BASE_URL}/category/${id}`);

// Model Functions
export const getAllModels = () => axios.get(API_MOD_URL);

export const createModel = (name) =>
  axios.post(API_MOD_URL, null, { params: { name } });

export const deleteModel = (id) =>
  axios.delete(`${API_MOD_URL}/${id}`);


export const getAssociationsForModel = async (modelId) => {
  return await axios.get(`${API_BASE_URL}/word-associations/${modelId}`);
};
export const getAllEmotionCategories = () => axios.get(`${API_BASE_URL}/emotion-categories`);
export const createAssociation = (word, emotionCategoryId) =>
  axios.post(`${API_BASE_URL}/word-association`, null, {
    params: { word, emotionCategoryId },
  });
export const deleteAssociation = (id) => axios.delete(`${API_BASE_URL}/word-association/${id}`);

export const saveCommunication = (data) => {
  return axios.post(API_COM_URL, data);
};

export const updateCommunication = (id, data) => {
  return axios.put(`${API_COM_URL}/${id}`, data);
};

export const deleteCommunication = (id) => {
  return axios.delete(`${API_COM_URL}/${id}`);
};

export const getAllCommunications = () => {
  return axios.get(API_COM_URL);
};
export const uploadFile = (file, modelName) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('modelName', modelName);

  return axios.post(`${API_COM_URL}/upload`, formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
      },
  });
};