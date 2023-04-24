export default class ColumnChart {
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link,
    formatHeading = value => value
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;

    this.render();
  }

  linkTemplate() {
    return this.link ? `
        <a href="${this.link}" class="column-chart__link">View all</a>
    ` : '';
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
        <div class="column-chart" style="--chart-height: ${this.chartHeight}">
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

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    } else {
      this.element.classList.add('column-chart_loading'); 
    }
  }

  update(data = []) {
    if (!data.length) {
      this.element.classList.add('column-chart_loading');
    }

    this.data = data;

    this.render();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
