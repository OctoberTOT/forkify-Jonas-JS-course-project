import View from "./view.js";
import icons from 'url:../../img/icons.svg';

class addRcipeView extends View {
    _parentEl = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaed :)'

    _window = document.querySelector('.add-recipe-window');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    _overlay = document.querySelector('.overlay')

    //controller has nothing to do with _addHandlerShowWindow, _addHandlerShowWindow is called when the object is created.
    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerCloseWindow();
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden')
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerCloseWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this))

    }

    addHandlerUpload(handler) {
        this._parentEl.addEventListener('submit', function (e) {
            e.preventDefault();
            //获取表单数据
            ///用 new FormData()获取表单的数据，返回一个不可用的object，将这个object解构为数组
            const dataArr = [...new FormData(this)];
            ///将上述的数组转化为对象
            const data = Object.fromEntries(dataArr)
            handler(data)

        })
    }

}

export default new addRcipeView();