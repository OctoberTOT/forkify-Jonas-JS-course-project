// import { async } from 'regenerator-runtime';

import { API_URL, RES_PER_PAGE, KEY } from './config.js';

import { AJAX } from './helperFunction.js';
//储存有关application的所有数据
export const state = {
    recipe: {},
    search: {
        //便于统计访问次数最多的菜谱
        query: '',
        result: [],
        page: 1,//第几页
        resultsPerPage: RES_PER_PAGE,//每页现实几个结果
    },
    bookmarks: [],
}

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        //仅在某些情况下增加属性
        ...(recipe.key && { key: recipe.key })
    };
};

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`)
        console.log(data);

        //摆脱原有{recipe}中的键名称中的‘_’
        state.recipe = createRecipeObject(data);

        if (state.bookmarks.some(bookmark => bookmark.id === id)) state.recipe.bookmarked = true
        else
            state.recipe.bookmarked = false;


    } catch (err) {
        console.error(`${err}🥲🥲🥲`);
        throw err;
    };
};

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);


        state.search.result = data.data.recipes.map(recipe => {
            return recipe = {
                id: recipe.id,
                publisher: recipe.publisher,
                image: recipe.image_url,
                title: recipe.title,
                ...(recipe.key && { key: recipe.key }),
            };
        });

    } catch (err) {
        console.error(`${err}🥲🥲🥲`);
        throw err;
    };

}


export const getResultsPerPage = function (page = state.result.page) {
    state.search.page = page;//储存页数便于渲染分页

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.result.slice(start, end)
};

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => { ing.quantity = newServings * ing.quantity / state.recipe.servings });
    state.recipe.servings = newServings;
};

export const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmarks = function (recipe) {
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
};

export const deleteBookmark = function (id) {
    // Delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
};

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage)
}

init();

export const uploadRecipe = async function (newRecipe) {
    // console.log(Object.entries(newRecipe));
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                const ingArr = ing[1].split(',').map(el => el.trim());

                if (ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format :)')
                const [quantity, unit, description] = ingArr;
                console.log([quantity, unit, description]);
                return { quantity: quantity ? +quantity : null, unit, description }
            })
        //创建符合上传API的object格式
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

        console.log(data);
        state.recipe = createRecipeObject(data);
        addBookmarks(state.recipe)

    } catch (err) {
        throw err;
    }


};

