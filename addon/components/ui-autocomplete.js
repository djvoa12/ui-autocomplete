import Ember from 'ember';
import layout from '../templates/components/ui-autocomplete';
import OptionListAriaMixin from 'ui-option-list/mixins/option-list-aria';

const { Component, computed, generateGuid, observer } = Ember;

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
