export default function() {
  this.transition(
    this.hasClass('ui-autocomplete'),
    this.use('tether', ['fade-up', { duration: 100 }])
  );

  this.transition(
    this.hasClass('ui-autocomplete-inline'),
    this.toValue(true),
    this.use('to-down'),
    this.reverse('to-up')
  );
}
