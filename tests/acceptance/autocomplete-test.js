import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

const autocomplete = '#autocomplete';
const autocompleteWithGroups = '#autocomplete-with-groups';

const autocompleteField = '.ff-autocomplete-field';
const firstOption = '.ff-option:first';
const lastOption = '.ff-option:last';

const moveDown = { keyCode: 40 };

const enter = { keyCode: 13 };


let application;

module('Acceptance | autocomplete', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('selecting an option', function(assert) {
  assert.expect(3);

  return visit('/')
    .then(() => {
      return fillIn(`${autocomplete} ${autocompleteField}`, 'T');
    })
    .then(() => {
      assert.equal(find(firstOption).text().trim(), 'Two');
      assert.equal(find(lastOption).text().trim(), 'Three');
      return click(lastOption);
    })
    .then(() => {
      assert.equal(find(`${autocomplete} ${autocompleteField}`).val(), 'Three');
    });
});

test('keyboard navigation', function(assert) {
  assert.expect(3);

  let focussed;

  return visit('/')
    .then(() => {
      return fillIn(`${autocomplete} ${autocompleteField}`, 'T');
    })
    .then(() => {
      focussed = find('.focussed');

      assert.equal(focussed.text().trim(), 'Two');

      Ember.$(`${autocomplete} ${autocompleteField}`).trigger(Ember.$.Event('keyup', moveDown));

      focussed = find('.focussed');

      assert.equal(focussed.text().trim(), 'Three');

      Ember.$(`${autocomplete} ${autocompleteField}`).trigger(Ember.$.Event('keyup', enter));

      assert.equal(find(`${autocomplete} ${autocompleteField}`).val(), 'Three');
    });
});

test('option group keyboard navigation', function(assert) {
  assert.expect(3);

  let focussed;

  return visit('/')
    .then(() => {
      return fillIn(`${autocompleteWithGroups} ${autocompleteField}`, 'e');
    })
    .then(() => {
      focussed = find('.focussed');

      assert.equal(focussed.text().trim(), 'New York');

      Ember.$(`${autocompleteWithGroups} ${autocompleteField}`).trigger(Ember.$.Event('keyup', moveDown));

      focussed = find('.focussed');

      assert.equal(focussed.text().trim(), 'One');

      Ember.$(`${autocompleteWithGroups} ${autocompleteField}`).trigger(Ember.$.Event('keyup', enter));

      assert.equal(find(`${autocompleteWithGroups} ${autocompleteField}`).val(), 'One');
    });
});

test('aria compatibility', function(assert) {
  let focussed;
  let autocompleteElement;

  return visit('/')
    .then(() => {
      autocompleteElement = find(`${autocomplete}`);

      assert.equal(autocompleteElement.attr('role'), 'combobox');
      assert.equal(autocompleteElement.attr('aria-autocomplete'), 'list');
      assert.equal(autocompleteElement.attr('aria-haspopup'), 'true');

      return click(`${autocomplete} ${autocompleteField}`);
    })
    .then(() => {
      assert.equal(autocompleteElement.attr('aria-expanded'), 'true');

      focussed = find('.focussed');
      assert.equal(autocompleteElement.attr('aria-activedescendant'), focussed.attr('id'));
    });
});
