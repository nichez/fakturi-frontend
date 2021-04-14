import axios from 'axios';
import * as actionTypes from './actionTypes';

const url = 'http://localhost:8080';

// Fetch Articles
export const fetchArticlesStart = () => {
  return {
    type: actionTypes.FETCH_ARTICLES_START,
  };
};

export const fetchArticlesSuccess = (articles) => {
  return {
    type: actionTypes.FETCH_ARTICLES_SUCCESS,
    articles: articles,
  };
};

export const fetchArticlesFail = (error) => {
  return {
    type: actionTypes.FETCH_ARTICLES_FAIL,
    error: error,
  };
};

export const fetchArticles = () => {
  return async (dispatch) => {
    dispatch(fetchArticlesStart());;

    try {
      const response = await axios.get(`${url}/articles`);
      if (response.status === 200) {
        dispatch(fetchArticlesSuccess(response.data));
        return response;
      }
    } catch (error) {
      console.log(error);
      fetchArticlesFail(error);
    }
  };
};

// Create Article
export const createArticleStart = () => {
  return {
    type: actionTypes.CREATE_ARTICLE_START,
  };
};

export const createArticleSuccess = (article) => {
  return {
    type: actionTypes.CREATE_ARTICLE_SUCCESS,
    article: article,
  };
};

export const createArticleFail = (error) => {
  return {
    type: actionTypes.CREATE_ARTICLE_FAIL,
    error: error,
  };
};

export const createArticle = (article, type) => {
  console.log('type', type)
  return async (dispatch) => {
    dispatch(createArticleStart());
    let response;
    try {
      if(type === 'create') {
        response = await axios.post(`${url}/articles`, article);
      } else {
        response = await axios.put(`${url}/articles/${article.shifra}`, article);
        console.log('update response', response)
      }
      if (response.status === 200 || response.status === 201) {
        dispatch(createArticleSuccess(article));
        return response;
      }
    } catch (error) {
      console.log(error);
      createArticleFail(error);
    }
  };
};