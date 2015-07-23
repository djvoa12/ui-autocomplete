export default function() {
  this.transition(
    this.hasClass('ui-autocomplete'),
    this.use('tether', 'fade-up')
  );
}
