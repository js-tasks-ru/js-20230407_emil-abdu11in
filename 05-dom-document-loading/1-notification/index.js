export default class NotificationMessage {
  constructor(content = '', {
    duration = 1000,
    type = 'success',
  } = {
    duration: 1000,
    type: 'success',
  }) {
    this.content = content;
    this.type = type;
    this.duration = duration;
    
    this.render();
  }

  get template() {
    const durationInSecond = this.duration / 1000;
    return `
    <div class="notification ${this.type}" style="--value:${durationInSecond}s">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
            ${this.content}
        </div>
      </div>
    </div>`;
  }

  render(node) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    const element = node || wrapper.firstElementChild;
    this.element = element;
  }

  show(node) {
    if (this.element) {
      this.destroy();
    }

    this.render(node);
    document.body.append(this.element);

    this.timerId = setTimeout(() => {
      this.destroy();
    }, this.duration);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    clearTimeout(this.timerId);
    this.element = null;
  }
}
