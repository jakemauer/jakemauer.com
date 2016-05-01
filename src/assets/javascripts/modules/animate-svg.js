import $ from 'jQuery'
import _ from 'lodash'
import remap from './remap'

module.exports = function() {
  let $paths  = $('.outlines path'),
      $window = $(window),
      windowX = $window.innerWidth(),
      windowY = $window.innerHeight(),
      longestLength = 0

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

  $('.container').addClass('start-animation')  

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