export function initialize(instance) {
  instance.container.lookup('service:liquid-target').addDefaultTarget('ui-autocomplete');
}

export default {
  name: 'add-autocomplete-target',
  initialize: initialize
};
