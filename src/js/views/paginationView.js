import View from "./view.js";
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentEl = document.querySelector('.pagination')

    _generateMarkup() {
        const currentPage = this._data.page;
        const pageNumber = Math.ceil(this._data.result.length / this._data.resultsPerPage);
        console.log(currentPage, pageNumber);
        //page1,and others
        if (currentPage === 1 && pageNumber > 1) {
            return `
          <button data-goto
          ="${currentPage + 1}" class="btn--inline pagination__btn--next">
            <span>page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `
        }
        //other page
        if (currentPage < pageNumber) {
            return `
            <button data-goto
            ="${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
          <button data-goto
          ="${currentPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `
        }
        //last pages,and others
        if (currentPage === pageNumber && pageNumber > 1) {
            return `
            <button data-goto
            ="${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
            `
        }
        //only one page
        return ` `

    }

    addHandlerClick(handler) {
        this._parentEl.addEventListener("click", function (e) {
            const btn = e.target.closest('.btn--inline');

            if (!btn) return;

            const goToPage = +btn.dataset.goto;

            handler(goToPage);
        })
    }

}

export default new PaginationView();