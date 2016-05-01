
module.exports = function( x, oMin, oMax, nMin, nMax ) {
  // range check
  if (oMin === oMax) return

  if (nMin === nMax) return

  // check reversed input range
  let reverseInput = false,
      oldMin = Math.min( oMin, oMax ),
      oldMax = Math.max( oMin, oMax )
  
  if (!(oldMin === oMin)){
    reverseInput = true 
  }

  // check reversed output range
  let reverseOutput = false,
      newMin = Math.min( nMin, nMax ),
      newMax = Math.max( nMin, nMax )
  if (!(newMin === nMin)) {
    reverseOutput = true
  }

  let portion = (x-oldMin)*(newMax-newMin)/(oldMax-oldMin)
  if (reverseInput){
    portion = (oldMax-x)*(newMax-newMin)/(oldMax-oldMin)
  }

  let result = portion + newMin
  if (reverseOutput){
      result = newMax - portion
  }

  return result
}

    