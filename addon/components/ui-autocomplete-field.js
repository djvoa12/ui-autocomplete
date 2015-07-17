import Ember from 'ember';

export default Ember.TextField.extend({
  bubbles: true,

  keyUp() {
    if (this.get('value')) {
      this.sendAction('open');
    } else {
      this.sendAction('close');
    }
  },

  keyDown(e) {
    if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 13) {
      this.sendAction('open');
      e.preventDefault();
    }
  },

  didLoseKeyResponder(){}
});
