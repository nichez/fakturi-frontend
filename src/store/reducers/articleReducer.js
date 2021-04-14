import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  articles: [],
  error: null,
  loading: false,
};

const fetchArticlesStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const fetchArticlesSuccess = (state, action) => {
  return updateObject(state, {
    articles: action.articles,
    error: null,
    loading: false,
  });
};

const fetchArticlesFail = (state, action) => {
  return updateObject(state, { loading: false, error: action.error });
};

const createArticleStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const createArticleSuccess = (state, action) => {
  let currentIndex;
  let item = action.article;

  console.log('reducer item', item)
  const found = state.articles.some((el, index) => {
    if (el.shifra === item.shifra) {
      currentIndex = index;
    }
    return el.shifra === item.shifra;
  });

  console.log('reducer found', found)

  if (found) {
    console.log('reducer IF item', item, currentIndex)
    return updateObject(state, {
      articles: [...state.articles],
      [state.articles[currentIndex]]: item
    });
  } else {
    console.log('reducer Else item', item)
    let updatedArticles = [...state.articles, item];

    return updateObject(state, {
      articles: updatedArticles,
      error: null,
      loading: false,
    });
  }
};

const createArticleFail = (state, action) => {
  return updateObject(state, { loading: false, error: action.error });
};

const articleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ARTICLES_START:
      return fetchArticlesStart(state, action);
    case actionTypes.FETCH_ARTICLES_SUCCESS:
      return fetchArticlesSuccess(state, action);
    case actionTypes.FETCH_ARTICLES_FAIL:
      return fetchArticlesFail(state, action);
    case actionTypes.CREATE_ARTICLE_START:
      return createArticleStart(state, action);
    case actionTypes.CREATE_ARTICLE_SUCCESS:
      return createArticleSuccess(state, action);
    case actionTypes.CREATE_ARTICLE_FAIL:
      return createArticleFail(state, action);
    default:
      return state;
  }
};

export default articleReducer;
