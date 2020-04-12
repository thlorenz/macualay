import React from 'react'

const getWindowWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth

const getWindowHeight = () => window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight


export function getWindowSize() {
  return { width: getWindowWidth(), height: getWindowHeight() }
}

export const windowResizeEffect = (setDimensions: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>) => () => {
  function onResize() {
    setDimensions({
      width: getWindowWidth(),
      height: getWindowHeight(),
    })
  }

  window.addEventListener('resize', onResize)
}
