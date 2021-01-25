import { html as createTemplate, render, TemplateResult } from 'lit-html';
import { getAttributeName, getAttributeValue } from './utilities/attributes.js';
import { getPropertyName, getPropertyValue, getReservedProperties } from './utilities/properties.js';
import { html } from './utilities/html.js';
import { Prop, prop } from './utilities/prop.js';

const reservedProps = getReservedProperties();

export function createElement(config) {
  config = Object.assign(
    {
      tagName: '',
      shadow: true,
      styles: '',
      props: {},
      state: {},
      methods: {}
    },
    config
  );

  return class extends HTMLElement {
    constructor() {
      super();
      this.props = {};
      this.state = {};
      this.stylesheet = `<style>${config.styles}</style>`;
      this.isRenderScheduled = false;
      this.isWatching = false;

      if (config.shadow) {
        this.attachShadow({ mode: 'open' });
      }

      // Ensure config.props are Prop objects
      Object.keys(config.props).map(propName => {
        config.props[propName] =
          config.props[propName] instanceof Prop ? config.props[propName] : new Prop({ value: config.props[propName] });
      });

      // Define props and add custom setters
      Object.keys(config.props).map(propName => {
        if (reservedProps.includes(propName)) {
          throw new Error(`Invalid prop name: "${getAttributeName(propName)}" is a global HTML attribute`);
        }

        if (this.hasOwnProperty(propName)) {
          throw new Error(`Invalid prop name: "${propName}" has already been declared`);
        }

        Object.defineProperty(this, propName, {
          get: () => this.getProperty(propName),
          set: value => {
            const oldValue = this.getProperty(propName);

            if (value !== oldValue) {
              this.setProperty(propName, value);
              this.reflectAttribute(propName);
              this.triggerWatcher(propName, oldValue, value);
              this.scheduleRender();
            }
          }
        });
      });

      // Define state and add custom setters
      Object.keys(config.state).map(stateName => {
        if (this.hasOwnProperty(stateName)) {
          throw new Error(`Invalid state name: "${stateName}" has already been declared`);
        }

        Object.defineProperty(this, stateName, {
          get: () => this.state[stateName],
          set: value => {
            const oldValue = this.state[stateName];

            if (value !== oldValue) {
              this.state[stateName] = value;
              this.scheduleRender();
            }
          }
        });
      });

      // Define public methods
      Object.keys(config.methods).map(methodName => {
        if (this.hasOwnProperty(methodName)) {
          throw new Error(`Invalid method name: "${methodName}" has already been declared`);
        }

        this[methodName] = config.methods[methodName].bind(this);
      });

      // Set initial props
      Object.keys(config.props).map(propName => {
        const attrName = getAttributeName(propName);

        // Look for an attribute first, then fall back to the default value
        if (this.hasAttribute(attrName)) {
          this.updatePropertyFromAttribute(attrName);
        } else {
          this.setProperty(propName, config.props[propName].value);
          this.reflectAttribute(propName);
        }
      });

      // Set initial states
      Object.keys(config.state).map(stateName => (this.state[stateName] = config.state[stateName]));
    }

    static get observedAttributes() {
      return Object.keys(config.props).map(getAttributeName);
    }

    static get tagName() {
      return config.tagName;
    }

    static register() {
      if (customElements.get(this.tagName)) {
        throw new Error(`A custom element has already been registered with the "${this.tagName}" tag.`);
      }

      customElements.define(this.tagName, this);
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
      // Sync attributes to properties as they change
      if (newValue !== oldValue) {
        this.updatePropertyFromAttribute(attrName);
        this.scheduleRender();
      }
    }

    connectedCallback() {
      if (typeof config.connected === 'function') {
        config.connected.call(this);
      }

      // Start watching now that we're connected
      this.isWatching = true;

      // Do the first render
      this.render();

      // The ready callback occurs after the component is connected and the first render has complete
      if (typeof config.ready === 'function') {
        config.ready.call(this);
      }
    }

    disconnectedCallback() {
      this.isWatching = false;

      if (typeof config.disconnected === 'function') {
        config.disconnected.call(this);
      }
    }

    emit(name, eventOptions) {
      const event = new CustomEvent(name, eventOptions);
      this.dispatchEvent(event);
    }

    getProperty(propName) {
      return this.props[propName];
    }

    setProperty(propName, value) {
      this.props[propName] = value;
    }

    reflectAttribute(propName) {
      const propValue = this.getProperty(propName);
      const attrName = getAttributeName(propName);
      const attrValue = getAttributeValue(propValue);

      // Only reflect props that have been opted in
      if (!config.props[propName].reflect) {
        return;
      }

      if (typeof attrValue === 'string') {
        this.setAttribute(attrName, attrValue);
      } else {
        this.removeAttribute(attrName);
      }
    }

    updatePropertyFromAttribute(attrName) {
      const attrValue = this.getAttribute(attrName);
      const propName = getPropertyName(attrName);
      const propValue = getPropertyValue(attrValue);

      this.setProperty(propName, propValue);
    }

    triggerWatcher(propName, oldValue, newValue) {
      if (this.isWatching && newValue !== oldValue && typeof config.props[propName]?.watch === 'function') {
        config.props[propName].watch.call(this, oldValue, newValue);
      }
    }

    render() {
      if (typeof config.render === 'function') {
        if (typeof config.beforeRender === 'function') {
          config.beforeRender.call(this);
        }

        const html = config.render.call(this);
        const template = createTemplate([...html.strings, this.stylesheet], ...html.values);
        const root = this.shadowRoot || this;
        render(template, root);
        this.isRenderScheduled = false;

        if (typeof config.afterRender === 'function') {
          config.afterRender.call(this);
        }
      }
    }

    async scheduleRender() {
      if (!this.isRenderScheduled) {
        this.isRenderScheduled = true;
        return new Promise(resolve =>
          requestAnimationFrame(() => {
            this.render();
            resolve(null);
          })
        );
      }
    }
  };
}

export * from './utilities/directives.js';
export { html } from './utilities/html.js';
export { prop } from './utilities/prop.js';
