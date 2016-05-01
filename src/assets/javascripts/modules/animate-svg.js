import $ from 'jQuery'
import _ from 'lodash'
import remap from './remap'

module.exports = function() {
  let $paths  = $('.outlines path'),
      $window = $(window),
      windowX = $window.innerWidth(),
      windowY = $window.innerHeight(),
      longestLength = 0,
      fragment = document.createDocumentFragment(),
      svgSource = $('.outlines'),
      svgShell = svgSource.clone().empty()

  $paths.each(function(){
    fragment.appendChild(svgShell.clone().html('<g>' + this.outerHTML + '</g>')[0])
  })


  $('.container').append(fragment)
  svgSource.remove()

  // $paths.each(function () {
  //   this.getBoundingClientRect()
  //   let length = this.getTotalLength()
  //   if (length > longestLength) { longestLength = length }
  // })

  // console.log(longestLength)
  let calculateWindowsize = function(){
    windowX = $window.innerWidth()
    windowY = $window.innerHeight()
  }

  let setArrayOffset = function(value) {
    $paths.each(function(){
      this.setAttribute('stroke-arrayoffset', value);
    })
  }

  let setDashArray = function(value) {
    $paths.each(function(){
      this.setAttribute('stroke-dasharray', value)
    })
  }

  $('svg').find('path').each(function () {
    this.getBoundingClientRect()
  }).end()
  .each(function(){
    let $this = $(this)
    let rnd = Math.floor(Math.random() * (200 - 0)) * 10
    $this.css({
      'transform': "perspective(800px) translate3d(0,0," + rnd + "px)"
    }).data('randomNum', rnd)
  })

  $('.container').addClass('start-animation')
                 .on('mousedown', function(){$(this).removeClass('inactive')})
                 .on('mouseup', function(){$(this).addClass('inactive')})
  
  $window.on('resize', _.debounce(calculateWindowsize, 150))
  $window.on('mousemove', function(e){
    let targetMin = -50,
        targetMax = 50,
        mouseX = e.clientX,
        mouseY = e.clientY,
        mappedX = remap( mouseX, 0, windowX, targetMin, targetMax),
        mappedY = remap( mouseY, 0, windowY, targetMin, targetMax)

        console.log('mousemove')
        $('svg').each(function(){
          let $this = $(this)
          $(this).css({
            'transform': 'perspective(800px) translate3d(' + mappedX + 'px,' + mappedY + 'px,'+ $this.data('randomNum') +'px)'
          })
        })

    // setArrayOffset(mappedX)
    // setDashArray(mappedY)
  })
}
