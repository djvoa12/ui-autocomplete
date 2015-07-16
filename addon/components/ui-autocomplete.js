import Ember from 'ember';
import layout from '../templates/components/ui-autocomplete';
import OptionListAriaMixin from 'ui-option-list/mixins/option-list-aria';

const { Component, computed, generateGuid, observer } = Ember;

const ProxyContent = Ember.Object.extend(Ember.PromiseProxyMixin);

export default Component.extend(OptionListAriaMixin, {
  layout: layout,
  fieldComponent: 'ui-autocomplete-field',

  classNames: ['ff-autocomplete'],

  attachment: 'top left',
  targetAttachment: 'bottom left',

  'show-placeholder-as-option': false,

  componentId: computed(function() {
    return generateGuid();
  }),

  /*
    This computed property wraps a passed promise
    and allows to watch this promise's state.

    @return {PromiseProxyObject} Promise Proxy
  */
  proxyContent: computed('async-items', 'items', function() {
    const asyncItems = this.get('async-items');

    if (!asyncItems) {
      return {
        content: this.get('items')
      };
    } else {
      return ProxyContent.create({
        promise: asyncItems
      });
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
  }),

  componentSelector: computed('componentId', function() {
    return `#${this.get('componentId')}`;
  }),

  selectedValues: computed(function() {
    return Ember.A();
  }),

  valueDidChange: observer('value', function() {
    const selectedValues = this.get('selectedValues');
    const value = this.get('value');

    selectedValues.clear();

    if (value) {
      selectedValues.pushObject(value);
    }
  }),

  focusOut() {
    if (!this.get('selectWillChange')) {
      this.send('close');
    }
  },

  actions: {
    open() {
      this.set('isOpen', true);

      Ember.run.next(() => {
        Ember.$('.ff-option-list').on('mousedown.ui-autocomplete', () => {
          this.set('selectWillChange', true);
        });
      });
    },

    close() {
      Ember.$('.ff-option-list').off('mousedown.ui-autocomplete');
      this.set('selectWillChange', false);

      this.set('isOpen', false);
    },

    selectItem(value) {
      this.set('value', value);
      this.sendAction('on-select', value);
      this.send('close');
    }
  }
});
