'use strict';
import $ from 'jquery';
import inlineSVG from 'inline-svg';
import animateSVG from './modules/animate-svg'

$(function(){
  inlineSVG.init({
    svgSelector: 'img.svg', // the class attached to all images that should be inlined
    initClass: 'js-inlinesvg', // class added to <html>
    storeResults: false // should the results be stored in localStorage
  }, animateSVG)  
})
