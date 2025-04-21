import axios from 'axios';
import useAuthToken from '@/UseAuth';

// const API_BASE_URL = 'https://purpleproj.click/emotion';
// const API_MOD_URL = 'https://purpleproj.click/models';
// const API_COM_URL = 'https://purpleproj.click/communications';

const API_BASE_URL = "http://localhost:8080/emotion";
const API_MOD_URL = "http://localhost:8080/models";
const API_COM_URL = "http://localhost:8080/communications";

const useEmotionApi = () => {
  const accessToken = useAuthToken();

  // Category Functions
  const createCategory = async (modelId, name) => {
    return await axios.post(`${API_BASE_URL}/category`, null, {
      params: { modelId, name },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const getCategoriesByModel = async (modelId) => {
    return await axios.get(`${API_BASE_URL}/category`, {
      params: { modelId },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const updateCategory = async (id, name) => {
    return await axios.put(`${API_BASE_URL}/category/${id}`, null, {
      params: { name },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const deleteCategory = async (id) => {
    return await axios.delete(`${API_BASE_URL}/category/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  // Model Functions
  const getAllModels = async () => {
    return await axios.get(API_MOD_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const getAllCustomModels = async () => {
    return await axios.get(`${API_MOD_URL}/custom`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const createModel = async (name) => {
    return await axios.post(API_MOD_URL, null, {
      params: { name },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const deleteModel = async (id) => {
    return await axios.delete(`${API_MOD_URL}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  // Association Functions
  const getAssociationsForModel = async (modelId) => {
    return await axios.get(`${API_BASE_URL}/word-associations/${modelId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const createAssociation = async (word, emotionCategoryId) => {
    return await axios.post(`${API_BASE_URL}/word-association`, null, {
      params: { word, emotionCategoryId },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const deleteAssociation = async (id) => {
    return await axios.delete(`${API_BASE_URL}/word-association/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  // Communication Functions
  const saveCommunication = async (data) => {
    return await axios.post(API_COM_URL, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const deleteCommunication = async (id) => {
    return await axios.delete(`${API_COM_URL}/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const getAllCommunications = async () => {
    return await axios.get(API_COM_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const uploadFile = async (file, modelName) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('modelName', modelName);

    return await axios.post(`${API_COM_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const uploadBatchFiles = async (formData) => {
    return await axios.post(`${API_COM_URL}/batch-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'blob', // Since the server returns a PDF
    });
  };

  return {
    // Categories
    createCategory,
    getCategoriesByModel,
    updateCategory,
    deleteCategory,
    // Models
    getAllModels,
    getAllCustomModels,
    createModel,
    deleteModel,
    // Associations
    getAssociationsForModel,
    createAssociation,
    deleteAssociation,
    // Communications
    saveCommunication,
    deleteCommunication,
    getAllCommunications,
    uploadFile,
    uploadBatchFiles,
  };
};

export default useEmotionApi;
