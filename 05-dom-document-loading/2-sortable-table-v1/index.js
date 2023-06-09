export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.render();
  }

  getSortArrowTemplate() {
    return `
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>
    `;
  }

  getHeaderTemplate() {
    return this.headerConfig
      .map(el => {
        return `
          <div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable}" data-order>
            <span>${el.title}</span>
            ${el.sortable ? this.getSortArrowTemplate() : ''}
          </div>`;
      })
      .join('');
  }

  getTemplateCell(el) {
    return this.headerConfig
      .map(({ id, template }) => {
        return template ? template(el[id]) : `<div class="sortable-table__cell">${el[id]}</div>`;
      })
      .join('');
  }

  getBodyTemplate() {
    return this.data
      .map(el => {
        return `
        <a href="/products/${el.id}" class="sortable-table__row">
          ${this.getTemplateCell(el)}
        </a>`;
      })
      .join('');
  }

  getEmptyTemplate() {
    return `
    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>`;
  }

  getLoadingTemplate() {
    return `<div data-element="loading" class="loading-line sortable-table__loading-line"></div>`;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getHeaderTemplate()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.getBodyTemplate()}
        </div>
      </div>
    `;

    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();
  }

  update() {
    this.subElements.body.innerHTML = this.getBodyTemplate();
  }

  sort(fieldValue, orderValue) {
    const directions = {
      asc: 1,
      desc: -1,
    };
    const direction = directions[orderValue];
    const langArr = ['ru', 'en'];
    const { sortType } = this.headerConfig.find(obj => obj.id === fieldValue);
    const numeric = sortType === 'number';
    const compareOptions = { caseFirst: 'upper', numeric };

    const compareStrings = (a, b) => {
      const currentElement = a[fieldValue].toString();
      const nextElement = b[fieldValue].toString();

      return direction * currentElement.localeCompare(nextElement, langArr, compareOptions);
    };

    this.data.sort(compareStrings);
    this.update();
  }


  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }
}

