import Ember from 'ember';
import layout from '../templates/components/ui-autocomplete';
import OptionListAriaMixin from 'ui-option-list/mixins/option-list-aria';

const { Component, computed, generateGuid, observer } = Ember;

const ProxyContent = Ember.Object.extend(Ember.PromiseProxyMixin);

export default Component.extend(OptionListAriaMixin, {
  layout: layout,
  'field-component': 'ui-autocomplete-field',

  classNames: ['ff-autocomplete'],

  to: 'ui-autocomplete',
  attachment: 'top left',
  'target-attachment': 'bottom left',
  constraints: [{
    to: 'window',
    attachment: 'together'
  }],

  'show-placeholder-as-option': false,

  componentId: computed(function() {
    return generateGuid();
  }),

  componentSelector: computed('componentId', function() {
    return `#${this.get('componentId')}`;
  }),

  /*
    This computed property wraps a passed promise
    and allows to watch this promise's state.

    @return {PromiseProxyObject} Promise Proxy
  */
  proxyContent: computed('async-items', 'items', function() {
    const asyncItems = this.get('async-items');

    if (isPromise(asyncItems)) {
      return ProxyContent.create({
        promise: asyncItems
      });
    } else {
      return {
        content: this.get('items') || []
      };
    }
  }),

  /*
    Checks if the promise is pending. Also takes input value
    into account (if the value is an empty string, promise is
    considered fulfilled).

    @return {Boolean} Whether promise is pending or not
  */
  isPromisePending: computed('proxyContent.isPending', 'value', {
    get() {
      const value = this.get('value');
      const isPending = this.get('proxyContent.isPending');

      return isPending && !!value;
    }
  }).readOnly(),

  selectedValues: computed(function() {
    return Ember.A();
  }),

  queryDidChange: observer('query', function() {
    const selectedValues = this.get('selectedValues');
    const query = this.get('query');

    this.sendAction('on-change', query);

    selectedValues.clear();

    if (query) {
      selectedValues.pushObject(query);
    }
  }),

  value: computed({
    set(key, value) {
      this.set('query', value);

      return value;
    }
  }),

  focusOut() {
    if (!this.get('selectionWillChange')) {
      this.send('close');
    }
  },

  willDestroyElement() {
    Ember.$(document).off('mousedown.ui-autocomplete');
  },

  actions: {
    open() {
      this.set('isOpen', true);

      Ember.run.next(() => {
        Ember.$(document).on('mousedown.ui-autocomplete', (e) => {
          if (Ember.$('.ff-autocomplete-menu').find(Ember.$(e.target)).length) {
            this.set('selectionWillChange', true);
          }
        });
      });
    },

    close() {
      Ember.$('.ff-autocomplete-menu').off('mousedown.ui-autocomplete');
      this.set('selectionWillChange', false);

      this.set('isOpen', false);
    },

    selectItem(value) {
      this.sendAction('on-select', value);
      this.send('close');
    }
  }
});

function isPromise(promise) {
  return promise instanceof Ember.RSVP.Promise;
}
