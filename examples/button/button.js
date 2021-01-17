import { classMap, createElement, html, prop } from '../../dist/index.js';

export const Button = createElement({
  tagName: 'my-button',
  shadow: true,
  styles: `
    .button {
      border: none;
      padding: .5rem 1rem;
      background: darkgray;
      border-radius: 3px;
      color: white;
    }

    .button--primary {
      background: #08d;
    }

    .button--secondary {
      background: tomato;
    }

    .button--focus {
      outline: none;
      box-shadow: 0 0 0 4px #058;
    }  
  `,

  //
  // Props
  //
  props: {
    // Props can be defined with initial values (default config options will be used)
    pill: false,
    size: 'medium',

    // Props that need custom config options must use the prop() function
    variant: prop({
      value: 'primary',
      reflect: true,
      watch: (oldValue, newValue) => console.log(`prop variant changed from ${oldValue} to ${newValue}`)
    })
  },

  //
  // State
  //
  state: {
    hasFocus: false
  },

  //
  // Public methods
  //
  methods: {
    announce() {
      console.log(`I'm a button!`);
    }
  },

  //
  // Lifecycle methods
  //
  connected() {
    console.log('connected');
  },

  ready() {
    console.log('ready');
  },

  disconnected() {
    console.log('disconnected');
  },

  beforeRender() {
    console.log('before render');
  },

  afterRender() {
    console.log('after render');
  },

  //
  // Rendering
  //
  render() {
    console.log('render');
    return html`
      <button
        type="button"
        class="${classMap({
          button: true,
          'button--primary': this.variant === 'primary',
          'button--secondary': this.variant === 'secondary',
          'button--pill': this.pill,
          'button--focus': this.hasFocus
        })}"
        @click="${() => this.announce()}"
        @focus="${handleFocus.bind(this)}"
        @blur="${handleBlur.bind(this)}"
      >
        <slot />
      </button>
    `;
  }
});

//
// Example functions with event emitters
//
function handleFocus() {
  this.hasFocus = true;
  this.emit('my-focus');
}

function handleBlur() {
  this.hasFocus = false;
  this.emit('my-blur');
}
