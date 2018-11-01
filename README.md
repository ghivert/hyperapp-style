# Hyperapp Style

Built around Hyperapp, Hyperapp Style let you inline style all your components without hassle, with all the power of CSS! When you use Hyperapp, you can use the `style` attribute out of the box, to inline style your elements. They are added in the `state` attribute in the generated HTML. Not anymore! When using Hyperapp Style, all the style you write in your HTML is directly compiled into CSS classes, and pushed directly to the DOM using CSS Object Model (or CSSOM)!

# An example?

```jsx
import { app } from 'hyperapp'
import h from 'hyperapp-style'

const state = {}
const actions = {}

const view = (state, actions) => (
  <div>
    <Navbar/>
    <Body/>
  </div>
)

const Navbar = () => (state, actions) => (
  <nav style={{ display: 'flex' }}>
    <img src='/cool-logo.png'/>
    <a href='#'>Home</a>
  </nav>
)

const Body = () => (state, actions) => (
  <div style={{ backgroundColor: 'blue' }}>
    <h1>I'm an incredible example!</h1>
  </div>
)

app(state, actions, view, document.getElementById('app'))
```

In this example, your div in Body will have a `background-color-blue` class linked in the class attribute, and the corresponding atomic class will be put into your browser, directly into a style node into the `head` section of the HTML page.

# API

## Using CSS

Describing the style for an element is easy: just use classic CSS, but camelized. `background-color` becomes `backgroundColor`, `font-size` becomes `fontSize`, etc. The CSS key is the object key, and you can just write as string or int the value you want.

## Using pseudo-classes

Every key you enter in the style object which does not have a value associated (i.e. which have an object) will be considered as pseudo-class entry. Let's say you want to have a different behavior when you hover an element. You can't use a `:hover` class when you're using an inline style. But with Hyperapp Style, you can. An example.

```jsx
import { app } from 'hyperapp'
import h from 'hyperapp-style'

const state = {}
const actions = {}

const view = (state, actions) => (
  <div>
    <Navbar/>
    <Body/>
  </div>
)

const Navbar = () => (state, actions) => (
  <nav style={{ display: 'flex' }}>
    <img src='/cool-logo.png'/>
    <a href='#'>Home</a>
  </nav>
)

// We want this component to be blue, and red when hovered.
const Body = () => (state, actions) => (
  <div style={{
    backgroundColor: 'blue',
    hover: {
      backgroundColor: 'red'
    }
  }}>
    <h1>I'm an incredible example!</h1>
  </div>
)

app(state, actions, view, document.getElementById('app'))
```

When using the `hover` key in the style attribute, and setting an object as value, all CSS inside the object will be considered as pseudo-classed! And this is working with everything you want: hover, active, inactive, invalid, valid, etc.

## About the media queries

There is three special cases in the style object: `widths` (and not `width`, which is regular CSS, be careful), `screen` and `mobile`. They are special keys used to generate media queries. The `screen` and `mobile` key are regular keys, like pseudo-classes, but generates media queries. (Under the hood, it computes the atomic class and surround the class with a `@media screen { the-rule }`.)  
`widths` is a little bit different: it accepts an array of objects as value, and each object is a regular style object as usual, but in which you can add a `max` and a `min` keys, which correspond to the `max-width` and `min-width` in the media queries! Let's illustrate this.

```jsx
import { app } from 'hyperapp'
import h from 'hyperapp-style'

const state = {}
const actions = {}

const view = (state, actions) => (
  <div>
    <Navbar/>
    <Body/>
  </div>
)

const Navbar = () => (state, actions) => (
  <nav style={{ display: 'flex' }}>
    <img src='/cool-logo.png'/>
    <a href='#'>Home</a>
  </nav>
)

// This component is green on small screens, yellow on medium, and
// red on huge screens. Text is also yellow on small screen and cyan
// on small mobile.
const Body = () => (state, actions) => (
  <div style={{
    widths: [{
      max: '450px',
      backgroundColor: 'green',
      screen: { color: 'yellow' },
      mobile: { color: 'cyan' }
    }, {
      min: '450px',
      max: '750px',
      backgroundColor: 'yellow'
    }, {
      min: '750px',
      backgroundColor: 'red'
    }],
    screen: {
      fontSize: '12px'
    },
    mobile: {
      fontSize: '16px'
    }
  }}>
    <h1>I'm an incredible example!</h1>
  </div>
)

app(state, actions, view, document.getElementById('app'))
```

To be precise on media queries, they are applied in order of importance, accordingly to the style object, from top to bottom. The last style applied on element will be the last style in the array.

# Final words

If you went through all of this, you're ready to use Hyperapp Style in all your Hyperapp apps!

# Contributing

I love to hear from you if you're using this package! Please, let me know if you encounter bugs or problem, and feel free to submit PR if you think you got something I didn't thought about!
