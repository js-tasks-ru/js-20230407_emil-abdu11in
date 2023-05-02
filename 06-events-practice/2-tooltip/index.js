class Tooltip {

  pointerMove = (event) => {
    const { clientX, clientY } = event;
    this.element.style = `top: ${clientY}px; left: ${clientX}px;`;
  }

  pointerOver = (event) => {
    const { tooltip } = event.target.dataset;

    if (tooltip) {
      document.addEventListener('pointermove', this.pointerMove);
      if (!this.element) {
        this.render(tooltip);
      } else {
        this.element.innerHTML = tooltip;
      }
    } else {
      this.destroy();
    }
  };

  constructor() {
    if (typeof Tooltip.instance === 'object') {
      return Tooltip.instance;
    }

    Tooltip.instance = this;

    return Tooltip.instance;
  }

  initialize () {
    document.addEventListener('pointerover', this.pointerOver);
  }

  getTemplate(content) {
    return `<div class="tooltip">${content}</div>`;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
    this.element = null;
    document.removeEventListener('pointermove', this.pointerMove);
  }

  render(content) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate(content);
    this.element = wrapper.firstElementChild;
    document.body.append(this.element);
  }
}

export default Tooltip;
