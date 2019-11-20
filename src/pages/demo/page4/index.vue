<template>
  <d2-container>
　　<div>
      <p slot="title" style="padding-bottom: 20px; padding-top: 5px;">
      　　监听程序日志
　　　　</p>
      <Button type="primary" @click="openSocket">开启日志</Button>&nbsp;&nbsp;
      <Button type="error" @click="closeSocket">关闭日志</Button><br><br>
      <div id="filelog-container" style="height: 400px; overflow-y: scroll; background: #333; color: #aaa; padding: 10px;">
      　　<div id="aa">{{pullFileLogger}}</div>
      </div>
    </div>
  </d2-container>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
export default {
  name: 'page4',
  data(){
    return {
        pullLogger: '',
        pullFileLogger: '正在连接websocket，请稍后~',
        stompClient: null
    }
  },
  methods:{
    openSocket () {
      if (this.stompClient === null) {
        console.log('打开websocket连接')
        this.pullFileLogger = '正在连接websocket，请稍后~'
        let _that = this
        var socket = new SockJS('http://localhost:8080/demo/websocket');
        _that.stompClient = Stomp.over(socket);
        _that.stompClient.connect({"Accept": "application/json, text/plain, */*"}, function(frame) {
          _that.stompClient.subscribe('/topic/pullFileLogger', function(event) {
            _that.pullFileLogger = ''
            var content = event.body
            var aa = document.getElementById('aa')
            var p = document.createElement('p')
            p.style.wordWrap = 'break-word'
            p.style.fontSize = 18 + 'px'
            p.appendChild(document.createTextNode(event.body))
            aa.appendChild(p)
            var div1 = document.getElementById('filelog-container')
            div1.scrollTop = div1.scrollHeight
          }, {
            "Accept": "application/json, text/plain, */*"
          })
        })
      }
    },
    closeSocket () {
      if (this.stompClient != null) {
        this.stompClient.disconnect()
        this.stompClient = null
        console.log("关闭websocket连接")
        this.pullFileLogger = 'websocket连接已关闭'
      }
    }    
  },
  //销毁页面之前，断开连接
  beforeDestroy: function () {
    //页面离开时断开连接,清除定时器
    this.closeSocket()
  },
  mounted(){
    //调用初始化websocket方法
    this.openSocket()
  }  
}
</script>
