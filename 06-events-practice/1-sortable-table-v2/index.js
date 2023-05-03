export default class SortableTable {
  onHeaderClick = (event) => {
    const sortedCell = event.target.closest('[data-sortable="true"]');


    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc',
      };

      return orders[order];
    };
  
    if (sortedCell) {
      const { id, order } = sortedCell.dataset;
      const newOrder = toggleOrder(order);
      const arrow = sortedCell.querySelector('.sortable-table__sort-arrow');

      sortedCell.dataset.order = newOrder;

      if (!arrow) {
        sortedCell.append(this.subElements.arrow);
      }

      this.sortOnClient(id, newOrder);
      this.subElements.body.innerHTML = this.getBodyTemplate();
    }
  }

  constructor(headersConfig = [], { data = [], sorted = {} } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;

    this.sortOnClient(sorted.id, sorted.order);
    this.render();
    this.initListeners();
  }

  getSortArrowTemplate() {
    return `
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>
    `;
  }

  getHeaderTemplate() {
    return this.headersConfig
      .map(el => { 
        const order = el.id === this.sorted.id ? this.sorted.order : '';
        return `
          <div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable || ''}" data-order="${order}">
            <span>${el.title}</span>
            ${el.sortable ? this.getSortArrowTemplate() : ''}
          </div>`;
      })
      .join('');
  }

  getTemplateCell(el) {
    return this.headersConfig
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

  initListeners() {
    const { header } = this.subElements;
    header.addEventListener('pointerdown', this.onHeaderClick);
  }

  update(name) {
    const methods = {
      header: this.getHeaderTemplate.bind(this),
      body: this.getBodyTemplate.bind(this),
    };

    const callMethod = methods[name];
    this.subElements[name].innerHTML = callMethod();
  }

  sortOnClient(id, order) {
    const direction = order === 'asc' ? 1 : -1;
    const fieldValue = id;

    const langArr = ['ru', 'en'];
    const { sortType } = this.headersConfig.find(obj => obj.id === fieldValue);
    const numeric = sortType === 'number';

    const compareOptions = { caseFirst: 'upper', numeric };

    const compareStrings = (a, b) => {
      const currentElement = a[fieldValue].toString();
      const nextElement = b[fieldValue].toString();
      return direction * currentElement.localeCompare(nextElement, langArr, compareOptions);
    };

    this.data.sort(compareStrings);
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
