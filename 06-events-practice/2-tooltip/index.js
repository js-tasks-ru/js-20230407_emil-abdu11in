class Tooltip {
  static instance;

  element;

  pointerMove = (event) => {
    const offset = 10;
    const { clientX, clientY } = event;
    const top = clientY + offset + 'px';
    const left = clientX + offset + 'px';

    this.element.style = `top:${top}; left:${left}`;
  }

  pointerOver = (event) => {
    const element = event.target.closest('[data-tooltip]');

    if (element) {
      this.render(element.dataset.tooltip);
      document.addEventListener('pointermove', this.pointerMove);
    }
  };

  pointerOut = (event) => {
    const element = event.target.closest('[data-tooltip]');

    if (element) {
      this.remove();
      document.removeEventListener('pointermove', this.pointerMove);
    }
  };

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize () {
    document.addEventListener('pointerover', this.pointerOver);
    document.addEventListener('pointerout', this.pointerOut);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener('pointerover', this.pointerOver);
    document.removeEventListener('pointermove', this.pointerMove);
    document.removeEventListener('pointerout', this.pointerOut);
    this.remove();
    this.element = null;
  }

  render(html) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = html;
    
    document.body.append(this.element);
  }
}

export default Tooltip;
