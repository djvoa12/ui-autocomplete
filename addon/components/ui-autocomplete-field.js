import Ember from 'ember';

export default Ember.TextField.extend({
  bubbles: true,

  focusIn() {
    this.sendAction('open');
  },

  keyDown(e) {
    if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 13) {
      this.sendAction('open');
      e.preventDefault();
    }
  },

  didLoseKeyResponder(){}
});
