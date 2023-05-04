import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
export default class ColumnChart {
    chartHeight = 50;

    constructor({
      url = '',
      range = {},
      label = '',
      value = 0,
      formatHeading = value => value,
      link = '',
    } = {}) {
      this.data = [];
      this.label = label;
      this.link = link;
      this.value = '';
      this.url = url;
      this.value = formatHeading(value);

      this.render();
      this.update(range.from, range.to);
    }

    linkTemplate() {
      return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
    }
  
    bodyTemplate() {
      const maxValue = Math.max(...this.data);
      const scaleValue = this.chartHeight / maxValue;

      return this.data
      .map(el => {
        const percent = ((el / maxValue) * 100).toFixed(0);
        return `<div style="--value: ${Math.floor(el * scaleValue)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
    }
  
    get template() {
      return `
        <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
          <div class="column-chart__title">
            Total ${this.label}
            ${this.linkTemplate()}
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${this.value}</div>
            <div data-element="body" class="column-chart__chart">
                ${this.bodyTemplate()}
            </div>
          </div>
        </div>`;
    }
  
    render() {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = this.template;
      this.element = wrapper.firstElementChild;
      this.subElements = this.getSubElements();
    }

    updateBodyTemplate() {
      this.subElements.body.innerHTML = this.bodyTemplate();

      if (!this.data.length) {
        this.element.classList.add('column-chart_loading');
      } else {
        this.element.classList.remove('column-chart_loading');
      }
    }
  
    update(from = new Date(), to = new Date()) {
      const url = new URL(`${BACKEND_URL}/${this.url}`);
      url.searchParams.set('from', from);
      url.searchParams.set('to', to);

      return fetchJson(url)
            .then(res => res)
            .then(data => {
              this.data = Object.values(data);
              this.updateBodyTemplate();
              return Promise.resolve(data);
            });
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
