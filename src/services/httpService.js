import axios from 'axios';

const url = 'http://localhost:8080';

export const getRequest = async (path, params = '') => {
  try {
    const response = await axios.get(`${url}${path}${params}`);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const postRequest = async (path, body) => {
  try {
    const response = await axios.post(`${url}${path}`, body);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const putRequest = async (path, body, params) => {
  try {
    const response = await axios.put(`${url}${path}${params}`, body);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteRequest = async (path, params) => {
  try {
    const response = await axios.delete(`${url}${path}${params}`);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
