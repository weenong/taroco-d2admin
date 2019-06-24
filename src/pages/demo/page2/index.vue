<template>
  <d2-container>
    <template slot="header">
       <el-button-group>
        <el-button type="primary" size="mini" @click="resetCanvas">选取</el-button>
        <el-button type="primary" size="mini" @click="removeObj">删除</el-button>
      </el-button-group>      
       <el-button-group>
        <el-button type="primary" size="mini" @click="addModel('caijiqi')">定位器</el-button>
        <el-button type="primary" size="mini" @click="addModel('huoche')">火车</el-button>
        <el-button type="primary" size="mini" @click="addModel('gudao')">股道</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="primary" size="mini" @click="setZoom(0.1)">放大</el-button>
        <el-button type="primary" size="mini" @click="setZoom(-0.1)">缩小</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="primary" size="mini" @click="guiji">轨迹</el-button>
        <el-button type="primary" size="mini" @click="baojing">报警</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="primary" size="mini" @click="save">保存</el-button>
      </el-button-group>
    </template>
    <canvas id="canvas"></canvas>
    <template slot="footer">footer</template>
  </d2-container>
</template>

<script>
import { fabric } from 'fabric'
import scenes from '@/libs/scenes.js'
export default {
  name: 'page2',
  data(){
    return {
      canvasObj: null,
      dragingCanvas: false,
      lastX: 0,
      lastY: 0
    }
  },
  computed: {
    
  },
  created() {
    console.log('created')
  },
  mounted() {
    console.log('mounted')
    let _this = this;
    setTimeout( ()=>{
      this.initCanvas()
      fabric.util.requestAnimFrame(function render() {
        _this.canvasObj.renderAll()
        fabric.util.requestAnimFrame(render)
      })
        
    },16)
  },
  methods:{
    initCanvas() {
      let _this = this
      this.canvasObj = new fabric.Canvas('canvas',{
        isDrawingMode: true,
        selectable: false,
        selection: false
      })
      fabric.Object.prototype.transparentCorners = false;
      const url = 'http://39.98.53.99:8082/d2admin/img/school.43aaa5ba.png'
      fabric.Image.fromURL(url, (img) => {
        const oImg = img.set({
            left: 0,
            top: 0
        })
        this.canvasObj.setBackgroundImage(oImg).renderAll()
      })
      this.canvasObj.freeDrawingBrush.color = '#E34F51'
      this.canvasObj.freeDrawingBrush.width = 2

      let img = new Image()
      img.src = url
      img.onload = function () {
        _this.canvasObj.setWidth(img.width)
        _this.canvasObj.setHeight(img.height)
      }
      _this.canvasObj.on('mouse:down', (e) => {
        if (e.e.altKey) {
          _this.dragingCanvas = true
          _this.canvasObj.selection = false
          _this.lastX = e.e.clientX
          _this.lastY = e.e.clientY
        }
      })
      _this.canvasObj.on('mouse:move', function(e) {
        if (_this.dragingCanvas) {
          _this.canvasObj.viewportTransform[4] += e.e.clientX - _this.lastX
          _this.canvasObj.viewportTransform[5] += e.e.clientY - _this.lastY
          _this.canvasObj.requestRenderAll()
          _this.lastX = e.e.clientX
          _this.lastY = e.e.clientY
        }
      })
      _this.canvasObj.on('mouse:up', function(e) {
        _this.dragingCanvas = false
        _this.canvasObj.selection = true
        
      })
      _this.canvasObj.observe("object:moving", function(e){
        var obj = e.target;
      })
    },
    resetCanvas() {
      this.canvasObj.isDrawingMode = false
      this.canvasObj.selectable = true
      this.canvasObj.selection = true
      this.canvasObj.skipTargetFind = false
    },
    setZoom(zoom) {
      const newZoom = this.canvasObj.getZoom() + zoom
      const center = this.canvasObj.getCenter()
      this.canvasObj.zoomToPoint({x: center.left, y: center.top}, newZoom)
    },
    addModel(type) {
      let _this = this;
      this.resetCanvas()
      switch (type) {
        case 'caijiqi':
          scenes.addCaiJiQi(_this.canvasObj)
          break;
        case 'huoche':
          scenes.addHuoChe(_this.canvasObj)
          break;
        case 'gudao':
          scenes.addGuDao(_this.canvasObj)
          break;          
        default:
          break;
      }
    },
    guiji() {
      let paths = []
      paths.push({x:0,y:10})
      paths.push({x:50,y:10})
      paths.push({x:50,y:50})
      paths.push({x:100,y:50})
      paths.push({x:100,y:10})
      paths.push({x:200,y:200})
      paths.push({x:400,y:300})
      paths.push({x:200,y:180})
      scenes.guiji(this.canvasObj,paths,0.05)
    },
    baojing() {
       let objs = this.canvasObj.getObjects('dingwei');
       objs.forEach((r,i)=>{
        r.setSrc('http://sfz.ruiysoft.cc:8081/huoche.png')
       })
    },
    removeObj() {
      const activeObjs = this.canvasObj.getActiveObjects()
      
      if(activeObjs && activeObjs.length >0){
        activeObjs.forEach((r,i)=>{
          this.canvasObj.remove(r)
        })
      }
      this.canvasObj.discardActiveObject()
    },
    save() {
      let objs = this.canvasObj.getObjects('caijiqi');
      console.log(objs[0].label + ',top:' + objs[0].top + ',left:' + objs[0].left)
      // console.log(this.canvasObj.toJSON())
      // console.log(JSON.stringify(this.canvasObj.toJSON()))
    }
  }
}
</script>
