import axios from 'axios';

const url = 'http://localhost:8080';

export const getRequest = async (path, params = '') => {
  const token = localStorage.getItem('token');

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.get(`${url}${path}${params}`, config);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const postRequest = async (path, body) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.post(`${url}${path}`, body, config);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const putRequest = async (path, body, params = '') => {
  const token = localStorage.getItem('token');

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.put(`${url}${path}${params}`, body, config);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteRequest = async (path, params) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.delete(`${url}${path}${params}`, config);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
