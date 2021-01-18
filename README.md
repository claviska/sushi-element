# Sushi Element 🍣

Sushi Element offers an expressive way to create standards-based [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) that work with (and without) your favorite framework. Notable features include:

- Expressive API
- Declarative templates
- Reactive data binding via props + state
- Fast, efficient rendering
- Lifecycle hooks
- Watchers
- Open source
- < 5 KB (minified + gzipped)

This experiment was created by [Cory LaViska](https://twitter.com/claviska) in New Hampshire.

## How it works

At the core of Sushi Element is a class factory called `createElement()` that accepts an object and returns a [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). You can use the resulting element in your HTML or [with your favorite framework](https://custom-elements-everywhere.com/).

Sushi Element is designed to be lightweight and stick to the platform as closely as possible. It uses [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) powered by [lit-html](https://lit-html.polymer-project.org/) for fast, efficient rendering with no virtual DOM requirement.

## Example syntax

Here's an obligatory counter example that increments a state variable and re-renders automatically on click.

```js
// counter.js
import { createElement, html } from 'sushi-element';

export const Counter = createElement({
  tagName: 'my-counter',
  state: {
    count: 0
  },
  render() {
    return html`
      <button type="button" @click="${() => this.count++}">
        Count: ${this.count}
      </button>
    `;
  }
});
```

To use the counter in your HTML:

```html
<script type="module">
  import { Counter } from './counter.js';
  Counter.register();
</script>

<my-counter></my-counter>
```

View this example in [CodePen](https://codepen.io/claviska/pen/vYXbGJv?editors=1010) or [JSFiddle](https://jsfiddle.net/claviska/u5p1aer7/).

For a more advanced example that uses more features, refer to `examples/button/button.js` or try it out on [CodePen](https://codepen.io/claviska/pen/qBagZpK?editors=1010) or [JSFiddle](https://jsfiddle.net/claviska/6h4o798b/).

## A note about "props" and state

In Sushi Element, the term "prop" refers to a form of state that the user controls by setting HTML attributes or JavaScript properties on the element. The term "state" refers to the element's internal state which the user has no control over. Changes to either will cause the element to re-render.

The concept of [attributes and properties](https://stackoverflow.com/a/6004028/567486) can be confusing, so Sushi Element abstracts them into "props." Internally, Sushi Element only looks at properties, but it will automatically sync attribute changes to their corresponding properties for better DX. This means that the color attribute in `<my-element color="blue">` will translate to `this.color = 'blue'` on the element instance and, if the attribute changes, `this.color` will update to match.

By default, property changes _will not_ reflect back to attributes. Thus, setting `this.color = 'tomato'` will update the property but not the attribute nor the DOM. You can modify this behavior by adding the `reflect` option to any prop, which will make `this.color = 'tomato'` reflect the attribute and result in `<my-element color="tomato">`. This can be useful if you intend to style your element with [attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).

Attributes are always lower-kebab-case and properties are always camelCase. For example, an attribute named `primary-color` will have a corresponding property of `primaryColor`. Sushi Element handles this conversion for you automatically.

## API

Inspiration for the API was taken from [Vue](https://vuejs.org/), [Stencil](https://stenciljs.com/), and [React](https://reactjs.org/), but no framework nor compiler is required to use Sushi Element.

The following functions are exported by the library:

### `createElement(config)`

Creates a custom element. The `config` argument can contain the following properties:

- `tagName: string` - The tag name to use for the custom element. Must include at least one hyphen, per the custom elements spec.
- `shadow?: boolean` - Whether or not to use shadow DOM. Default `true`.
- `styles?: string` - The CSS to inject into the component.
- `props?: { [key: string]: Prop | any }` - The element's props. The object key is the prop name and the value can be the prop's default value or a `Prop` object with options created by the `prop()` function. On init, the default value will be overridden if a corresponding attribute is set on the element.
- `state?: { [key: string]: any }` - The element's state variables. The object key is the state name and the value is the initial value.
- `methods?: { [key: string] : () => void }` - Public methods to assign to the element. The object key is the method name. All public methods are called in the context of the host element, so `this` will refer to the element instance.
- `connected?: () => void` - Called when the element is first connected to the DOM.
- `disconnected?: () => void` - Called when the element is disconnected from the DOM.
- `ready?: () => void` - Called when the element has been connected and after the first render has completed.
- `beforeRender?: () => void` - Called once before each render.
- `afterRender?: () => void` - Called once after each render.

_All lifecycle methods and custom methods are called in the context of the host element, so `this` will refer to the element's instance._

The resulting custom element will have a static `register()` method that you can use to register the custom element. This is the same as calling `customElements.define()`, but it can be chained for convenience.

```js
// Shortcut for creating + registering
createElement({ ... }).register();
```

### `prop(options)`

Defines a prop with additional options. The `options` argument can contain the following properties:

- `value?: any` - The prop's default value.
- `reflect?: boolean` - Reflects the prop back to the attribute when possible. The value must be a string, number, or boolean for the prop to reflect. Default `false`.
- `watch?: () => void` - A function to call each time the prop changes.

Example:

```js
const el = createElement({
  props: {
    // Prop with no options
    size: 'medium'

    // Prop with options
    color: prop({
      value: 'tomato',
      reflect: true,
      watch: (oldValue, newValue) => console.log(`color changed from ${oldValue} to ${newValue}`)
    })
  }
})
```

### `html(strings, ...values)`

Used only in the `render()` method to generate a template. This should always be called as a tagged template literal:

```js
render() {
  return html`
    <h2>My Template</h2>
  `;
}
```

See the Templates section for more information about writing templates.

## Templates

Templates are powered by [lit-html](https://lit-html.polymer-project.org/), so all the rules and examples for [writing templates](https://lit-html.polymer-project.org/guide/writing-templates) apply.

This section of the docs will be expanded in the future, so please refer to the examples on the lit-html website for now.

### Directives

Directives are functions that make writing templates even easier. For now, please refer to lit-html's [directives page](https://lit-html.polymer-project.org/guide/template-reference#built-in-directives) for details.

For convenience, Sushi Element exports lit-html's `classMap`, `live`, `nothing`, and `styleMap` directives. Additional directives can be imported from lit-html or from your own [custom directive](https://lit-html.polymer-project.org/guide/creating-directives) module.

## Events

Each element will have an `emit()` method that lets you dispatch [custom events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) easily. The first argument is the event name and an optional second argument lets you provide details and additional options for the event (e.g. `composed`, `bubbles`, etc.)

Here's an example of how you can use it:

```js
render() {
  return html`
    <button
      @focus="${() => this.emit('my-focus-event')}"
      @blur="${() => this.emit('my-blur-event', { detail: 'this will be available in event.detail' })}"
    >
      Click me
    </button>
  `;
}
```

To listen to events, use `addEventListener()` as you normally would.

## Developers

- Use `npm start` to build + watch
- Use `npm build` to build
- Use `npm run sandbox` to build + watch + launch a dev server that points to the examples directory

This is still somewhat experimental and there's still some work to do with it.

- Add [JSDoc types](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- Add tests

## What relevance does the word "sushi" have to this project?

Probably none. I just needed a quick name to start hacking on it. But in hindsight, the concept of sushi seems to parallel many aspects of component-driven development. Just like apps, sushi is comprised of many smaller components (nori, rice, fish, roe, wasabi) and can range from very simple (sashimi) to very complex (uramaki).

And, just like sushi, I don't expect that everyone will enjoy this library, but I do hope they at least try it and see how simple crafting lightweight, standards-based web components can be!
