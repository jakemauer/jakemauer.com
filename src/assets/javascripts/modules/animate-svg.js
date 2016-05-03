import $ from 'jQuery'
import _ from 'lodash'
import random from './random'
import remap from './remap'

module.exports = function() {
  let $paths  = $('.outlines path'),
      $window = $(window),
      windowX = $window.innerWidth(),
      windowY = $window.innerHeight(),
      fragment = document.createDocumentFragment(),
      svgSource = $('.outlines'),
      svgShell = svgSource.clone().empty()

  let utilities = {
    calculateWindowsize(){
      windowX = $window.innerWidth()
      windowY = $window.innerHeight()
    },
    setArrayOffset(value) {
      $paths.each(function(){
        this.setAttribute('stroke-arrayoffset', value);
      })
    },
    setDashArray(value) {
      $paths.each(function(){
        this.setAttribute('stroke-dasharray', value)
      })
    }
  }

// =============
// Prepare SVGs
// =============
  $paths.each(function(i){
    let length = this.getTotalLength()
    if (length < 200) return 
    if (random(0,10) > 7) return
    fragment.appendChild(svgShell.clone().html('<g>' + this.outerHTML + '</g>')[0])
  })


  $('.container').append(fragment)
  svgSource.remove()


// ================
// SVG translation
// ================
  $('.outlines')
    .find('path').each(function () {
      this.getBoundingClientRect()})
    .end()
    .each(function(){
      let $this = $(this)
      let rnd = random(0, 200) * 5
      $this.css({
        'transform': "perspective(800px) translate3d(0,0," + rnd + "px)"
      }).data('randomNum', rnd)
    })

  let collapse = function(){
    $('container').addClass('collapse').removeClass('hide-background')
  }

  let collpaseTimeout
  let collapseFallback = function(){
    collapseTimeout = window.setTimeout(collapse, 3000)
  }


// ===============
// Event Listeners
// ===============
// == Collapse SVGs onto face
  let transitionEndCount = 0
  $('.outlines').first().on('transitionend', function(){
    transitionEndCount++
    if (transitionEndCount >= 4) {
      $('.container')
        .addClass('collapse')
        .on('mousedown', function(){
          // window.clearTimeout(collapseTimeout)
          $(this).removeClass('collapse hide-background')
        })
        .on('mouseup', function(){$(this).addClass('collapse')})
      $('.outlines').off('transitionend')
      // collapseFallback()
    }
  })

  $window
    .on('resize', _.debounce(utilities.calculateWindowsize, 150))
    .on('mousemove', function(e){
      let targetMin = -50,
          targetMax = 50,
          mouseX = e.clientX,
          mouseY = e.clientY,
          mappedX = remap( mouseX, 0, windowX, targetMin, targetMax),
          mappedY = remap( mouseY, 0, windowY, targetMin, targetMax)

      $('.outlines').each(function(){
        let $this = $(this)
        $(this).css({
          'transform': 'perspective(800px) translate3d(' + mappedX + 'px,' + mappedY + 'px,'+ $this.data('randomNum') +'px)'
        })
      })
    })



  // ==================
  // Start the sequence
  // ==================

  $('.container').addClass('start-animation')

}
