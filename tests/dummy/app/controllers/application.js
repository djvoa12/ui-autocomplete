import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  options: Ember.A([{
      label: 'One',
      value: 1
    }, {
      label: 'Two',
      value: 2
    }, {
      label: 'Three',
      value: 3
    }
  ]),

  filteredOptions: computed('options.@each', 'value', function() {
    const regex = new RegExp(this.get('value'), 'i');

    return Ember.A(this.get('options').filter((option) => {
      return option.label.search(regex) > -1;
    }));
  }),

  optionGroups: Ember.A([{
    label: 'States',
    items: Ember.A([{
      label: 'California',
      value: 'CA'
    }, {
      label: 'New York',
      value: 'NY'
    }, {
      label: 'Washington',
      value: 'WA'
    }])
  }, {
    label: 'Numbers',
    items: Ember.A([{
      label: 'One',
      value: 1
    }, {
      label: 'One Hundred and One',
      value: 101
    }, {
      label: 'One Million',
      value: 1000000
    }])
  }, {
    label: 'People',
    items: Ember.A([{
      label: 'Bill Gates',
      value: 'BG'
    }, {
      label: 'Steve Jobs',
      value: 'SJ'
    }])
  }]),

  filteredOptionGroups: computed('optionGroups.@each.items.@each', 'value', function() {
    const regex = new RegExp(this.get('value'), 'i');

    return this.get('optionGroups').map((group) => {
      return {
        label: group.label,
        items: Ember.A(group.items.filter((option) => {
          return option.label.search(regex) > -1;
        }))
      };
    });
  }),

  actions: {
    setValue(value) {
      console.log('test');
      this.set('value', value);
    },

    setValueManually(value) {
      this.set('value', value);
    }
  }
});
