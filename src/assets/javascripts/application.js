'use strict';
import jQuery from 'jquery';
import inlineSVG from 'inline-svg';

jQuery(function(){
  inlineSVG.init({
    svgSelector: 'img.svg', // the class attached to all images that should be inlined
    initClass: 'js-inlinesvg', // class added to <html>
    storeResults: false // should the results be stored in localStorage
  })  
})
