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
