import { fabric } from 'fabric'
import '@/libs/sprite.class.js'
let scenes = {}

scenes.addGuDao = function (canvasObj) {
  fabric.Image.fromURL('http://sfz.ruiysoft.cc:8081/gudao.png', function (oImg) {
    oImg.scale(0.1)
    oImg.type = 'gudao'
    canvasObj.add(oImg)
  })
}
scenes.addHuoChe = function (canvasObj) {
  fabric.Image.fromURL('http://sfz.ruiysoft.cc:8081/huoche.png', function (oImg) {
    oImg.scale(0.1)
    oImg.type = 'huoche'
    canvasObj.add(oImg)
  })
}
scenes.addCaiJiQi = function (canvasObj) {
  // fabric.Image.fromURL('http://sfz.ruiysoft.cc:8081/station.png', function (oImg) {
  //   oImg.scale(0.1)
  //   oImg.type = 'caijiqi'
  //   canvasObj.add(oImg)
  // })
  fabric.Object.prototype.transparentCorners = false
  fabric.Sprite.fromURL('sprite.png', createSprite(canvasObj), { label: 'aaaa' })
}

function createSprite (canvasObj) {
  return function (sprite) {
    sprite.set({
      left: 50,
      top: 50,
      type: 'caijiqi'
    })
    canvasObj.add(sprite)

    sprite.set('dirty', true)
    sprite.play()
  }
}

scenes.guiji = function (canvasObj, paths, speed) {
  fabric.Image.fromURL('https://img0.sc115.com/uploads2/sc/png/4440/0.png', function (oImg) {
    oImg.set({
      left: paths[0].x,
      top: paths[0].y,
      originX: 'center',
      originY: 'center',
      selectable: false
    })
    oImg.scale(0.1)
    oImg.type = 'dingwei'
    oImg.lastPoint = { left: paths[0].x, top: paths[0].y }
    canvasObj.add(oImg)
    let i = 1
    guiji(canvasObj, oImg, paths, i, speed)
  })
}

function guiji (canvasObj, oImg, paths, i, speed) {
  if (i < paths.length) {
    let c = Math.atan2(paths[i].y - paths[i - 1].y, paths[i].x - paths[i - 1].x) * 180 / (Math.PI)
    oImg.rotate(c + 90)
    let distance = Math.sqrt((paths[i - 1].x - paths[i].x) * (paths[i - 1].x - paths[i].x) + (paths[i - 1].y - paths[i].y) * (paths[i - 1].y - paths[i].y))
    oImg.animate({ left: paths[i].x, top: paths[i].y }, {
      duration: distance / speed,
      onChange: () => {
        canvasObj.requestRenderAll()
        let points = [oImg.lastPoint.left, oImg.lastPoint.top, oImg.left, oImg.top]

        let line = new fabric.Line(points, {
          strokeWidth: 3,
          stroke: 'black',
          selectable: false
        })
        canvasObj.add(line)
        oImg.lastPoint = { left: oImg.left, top: oImg.top }
        oImg.bringToFront()
      },
      onComplete: function () {
        guiji(canvasObj, oImg, paths, ++i, speed)
      }
    })
  } else {
    oImg.rotate(0)
  }
}

export default scenes
