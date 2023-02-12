import View from "./view.js";
import previewView from "./previewView.js";
import icons from 'url:../../img/icons.svg';

class bookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list')
  _errorMessage = "No bookmarks! Find a recipe and bookmark it. :)"

  _generateMarkup() {
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('')
  }
};


export default new bookmarkView();