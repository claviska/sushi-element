import { createElement, html } from '../../dist/index.js';

export const Counter = createElement({
  tagName: 'my-counter',
  state: {
    count: 0
  },
  render() {
    return html`<button type="button" @click="${() => this.count++}">Count: ${this.count}</button>`;
  }
});
