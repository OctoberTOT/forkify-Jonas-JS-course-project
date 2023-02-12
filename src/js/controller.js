import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

//导入的目的是为了创建新的object使得addEventHandler运行
import addRecipeView from './views/addRecipeView.js';
import { loadRecipe } from './model.js';

import icons from 'url:../img/icons.svg';
//console.log(icons);//网址
import 'core-js/stable';//polyfilling everything eles
import 'regenerator-runtime/runtime'//polyfilling async/await
import { async } from 'regenerator-runtime';
import { MODAL_CLOSE_SEC } from './config.js';

//syntax with Parcel 改变代码时仅清除console并防止页面重新加载
// if (module.hot) {
//   module.hot.accept();
// }

//🔢
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    //guard clauses
    if (!id) return;
    recipeView.renderSpinner();

    //update resultView to marked the selected recipe
    resultsView.update(model.getResultsPerPage(1));
    bookmarksView.render(model.state.bookmarks)

    //loading recipe
    await model.loadRecipe(id);

    //render recipe
    recipeView.render(model.state.recipe);
    console.log(model.state.recipe);


  } catch (err) {
    //render error
    recipeView.renderError()

  }
};

const controlSearchResult = async function () {
  try {

    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    //loading results
    await model.loadSearchResults(query);
    // console.log(model.state.search.result);

    //render result
    resultsView.render(model.getResultsPerPage(1))

    //render pagination
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err);
    resultsView.renderError();

  }
};

const controlPagination = function (goToPage) {
  //render NEW result
  resultsView.render(model.getResultsPerPage(goToPage));

  //render NEW pagination
  paginationView.render(model.state.search)
};

const controlBookmarks = function () {
  //add/delete bookmark
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  //update recipe
  recipeView.update(model.state.recipe)

  //render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //render message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    //close the windowform
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);


  } catch (err) {
    console.error('👀', err);
    addRecipeView.renderError(err.message)
  }

};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings)
  //render the recipe view
  recipeView.update(model.state.recipe)

}

// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, getRecipe));
// window.addEventListener('hashchange', getRecipe);
// window.addEventListener('load', getRecipe);

//publisher - subscriber pattern
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUploadServings(controlServings);
  recipeView.addHandlerAddBookmerk(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();