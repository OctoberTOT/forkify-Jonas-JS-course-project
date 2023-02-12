import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  renderSpinner() {
    const markup =
      `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
      `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

  //渲染整个***view
  render(data, render = true) {
    //没有数组 or 有数组且为空数组
    //.isArray(value)=>用于确定传递的值是否为一个Array
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    //Element.insertAdjacentHTML(POSITION,TEXT)
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

  //渲染动态变化的部分
  update(data) {

    // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    console.log(data);
    const newMarkup = this._generateMarkup();

    //①将newMarkup strings 转换为DOM object
    //document.createRange()=>返回一个Range object(一个包含node和部分 node text的document fragment)
    //Range.createContextualFragment()=>1️⃣将输入的parameter：taxString（即一种包含Text和Tag的文本）转换为一个DocumentFragment object。2️⃣这个method的适用情况=>一种解析HTML或XML的算法，解析的起点为被选中节点的parent node（将这个母节点作为context node）
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    //②比较更新后的Elements和当先Elements
    //将新产生的虚拟DOM(即没有render在view中的DOM)转换为数组
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //updates changed TEXT
      if (!newEl.isEqualNode(curEl) &&
        //optional chain 如果?.链接的对象是undefined or null 则会短路
        newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      //updates changed attributes
      if (!newEl.isEqualNode(curEl)) Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));

    });

  }

  _clear() {
    this._parentEl.innerHTML = ''
  }

  renderSpinner() {
    const markup =
      `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div> 
        `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

}