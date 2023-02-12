class SearchView {
    #parentEl = document.querySelector('.search');

    getQuery() {
        const query = this.#parentEl.querySelector('.search__field').value;
        this._clearInput();
        return query;

    }

    _clearInput() {
        this.#parentEl.querySelector('.search__field').text = ''
    }

    addHandlerSearch(handler) {
        this.#parentEl.addEventListener("submit", function (e) {
            //防止表格form重新加载 reload
            e.preventDefault();
            handler();
        })
    }

};

export default new SearchView();