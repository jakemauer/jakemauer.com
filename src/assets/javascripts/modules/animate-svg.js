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
    let $this = $(this)
    $this.parents('svg').css({
      'transform': "perspective(400px) translate3d(0,0," + Math.floor(Math.random() * (200 - 0)) + 0 + "px)"
    })
  //   let length = this.getTotalLength()
  //   if (length > longestLength) { longestLength = length }
  })

  $('.container').addClass('start-animation')
                 .on('mousedown', function(){$(this).removeClass('inactive')})
                 .on('mouseup', function(){$(this).addClass('inactive')})
  // $window.on('resize', _.debounce(calculateWindowsize, 150))

  // $window.on('mousemove', function(e){
  //   let targetMin = 1,
  //       targetMax = 100,
  //       mouseX = e.clientX,
  //       mouseY = e.clientY

  //   let mappedX = remap( mouseX, 0, windowX, targetMin, targetMax),
  //       mappedY = remap( mouseY, 0, windowY, targetMin, targetMax)

  //   setArrayOffset(mappedX)
  //   setDashArray(mappedY)
  // })
}
