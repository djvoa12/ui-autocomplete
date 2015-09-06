# ui-autocomplete

This is an autocomplete component addon for Ember CLI, composed of input and results sub-components.  The default input is an `Ember.TextField` component, but one can also replace it with a customized input component.

The results component can be displayed inline, following the normal document flow, or can be absolutely positioned (using ember-tether).

## Demo

See [demo](`http://firefly-ui.github.io/ui-autocomplete`).

## Installation

1) Add `"ui-autocomplete": "firefly-ui/ui-autocomplete#{latest version}"` to your `package.json`.

2) `npm install`.

Note: This is not yet published on npm.

## Usage

To display input results, you can pass in an array of objects (as a response from a server) or a promise, which will be resolved within the component. The default loading message, or a user-provided loader component, will be displayed during the async operation.

#### Array

###### Simple Options

You can pass the data into `items`. The results are iterated and displayed accordingly. See below.

```javascript
// template.hbs
{{#ui-autocomplete
  id="{insert id here}"
  placeholder="Select..."
  value=value
  on-select="setValue" // action handler
  inline=true // to display inline
  items=items as |item|}} // array passed in
  {{#ui-option value=item.label}}
    {{item.label}}
  {{/ui-option}}
{{else}}
  No results!
{{/ui-autocomplete}}
```

```javascript
// component.js, controller.js, etc.
items: Ember.A([{
    label: 'SF',
    value: 'San Francisco'
  }, {
    label: 'NY',
    value: 'New York'
  }, {
    label: 'LA',
    value: 'Los Angeles'
  }
])
```

###### Grouped Options

Grouped Options enable you to add and display header labels for each sub-group.

```javascript
// template.hbs
{{#ui-autocomplete
  id="{insert id here}"
  placeholder="Select..."
  value=value
  on-select="setValue" // action handler
  inline=true // to display inline
  items=groups as |group|}} // array passed in
  {{#ui-option-group label=group.label items=group.items as |item|}}
    {{#ui-option value=item.label}}
      {{item.label}}
    {{/ui-option}}
  {{/ui-option-group}}
{{/ui-autocomplete}}
```

```javascript
// component.js, controller.js, etc.
groups: Ember.A([{
  label: 'Cities',
  items: Ember.A([{
    label: 'SF',
    value: 'San Francisco'
  }, {
    label: 'NY',
    value: 'New York'
  }, {
    label: 'LA',
    value: 'Los Angeles'
  }])
}, {
  label: 'Sizes',
  items: Ember.A([{
    label: 'S',
    value: 'Small'
  }, {
    label: 'M',
    value: 'Medium'
  }, {
    label: 'L',
    value: 'Large'
  }])
}
```

#### Promise

Use `async-items` property to pass in a promise.

```javascript
// template.hbs
{{#ui-autocomplete
    inline=true
    placeholder="placeholder"
    on-change="setValue" // action handler
    value=value
    async-items=results as |item|}}
  {{#ui-option value=item.label}}
    // insert html or display component here
  {{/ui-option}}
{{else}}
  {{ui-option value="No Results"}}
{{/ui-autocomplete}}
```

##### Setting the value within your application

When input value is added/altered, it will immediately `sendAction()` to an action handler (i.e. `setValue`), outside of this component into your app.

```javascript
// component.js, controller.js, etc.
setValue(value) {
  // Example:
  // this.set('value', value);
}
```

##### Debouncing

You will also want to use `Ember.run.debounce` to rate limit your ajax requests.

Check out Ember debounce docs [here](http://emberjs.com/api/classes/Ember.run.html#method_debounce).

```javascript
setValue(value) {
  // Example:
  // Ember.run.debounce(this, this.set, 'value', value, 400);
}
```

[Why you should I limit my requests?](http://benalman.com/code/projects/jquery-throttle-debounce/examples/debounce/)

##### Promise via computed property

```javascript
// component.js, controller.js, etc.
results: computed('value', function() {
  // computed property should watch for value change
  // and return a promise (i.e. ajax request to server)
})
```

##### Loader-Component (For Promises)

You can optionally pass in your own component to display, while the promise is being resolved (i.e. loading message, random quote, spinner, etc.).  Otherwise, it will show `<span>Loading...</span>` by default.

```javascript
// template.hbs
{{#ui-autocomplete
    inline=true
    placeholder="placeholder"
    on-change="setValue" // action handler
    value=value
    loader-component="your-loader-component" // optional
    async-items=results as |item|}}
  {{#ui-option value=item.label}}
    // insert html or display component here
  {{/ui-option}}
{{else}}
  {{ui-option value="No Results"}}
{{/ui-autocomplete}}
```

## Legal

[MIT License](http://opensource.org/licenses/mit-license.php)
