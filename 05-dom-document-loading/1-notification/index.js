export default class NotificationMessage {
  static instance;

  constructor(content = '', {
    duration = 1000,
    type = 'success',
  } = {}) {
    this.content = content;
    this.type = type;
    this.duration = duration;
    
    this.render();
  }

  get template() {
    return `
    <div class="notification ${this.type}" style="--value:${this.duration}ms">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.content}
        </div>
      </div>
    </div>`;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    const element = wrapper.firstElementChild;
    this.element = element;
  }

  show(parentNode = document.body) {
    if (NotificationMessage.instance) {
      this.remove();
    }

    parentNode.append(this.element);

    NotificationMessage.instance = this;
  
    this.timerId = setTimeout(() => {
      this.destroy();
    }, this.duration);
  }

  remove() {
    clearTimeout(this.timerId);

    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
