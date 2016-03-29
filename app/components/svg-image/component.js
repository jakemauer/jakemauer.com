import Ember from 'ember';
let {set, get} = Ember

export default Ember.Component.extend({
  didInsertElement(){
    this.setupListeners()
    var paths = document.getElementsByTagName("path"),
    paths_count = paths.length;

    for (var i = 0; i < paths_count; i++) {
      var path = paths[i];
      var path_length = Math.floor(paths[i].getTotalLength())
      path.setAttribute('stroke', '#000');
      path.setAttribute('fill', '#fff');
      path.setAttribute('stroke-linecap', 'round'); 
      path.setAttribute('stroke-width', '5.0'); 
      path.setAttribute('stroke-dasharray', 50);
      path.setAttribute('stroke-dashoffset', 80);
    }
  },
  willDestroy() {
    this.removeListeners()
  },
  
  setupListeners(){
    Ember.$(window).on('mousemove', e => {
      this.set('mouseX', e.clientX )
      this.set('mouseY', e.clientY)
    })
  },

  removeListeners(){
    Ember.$(window).off('mousemove')
  }

});
