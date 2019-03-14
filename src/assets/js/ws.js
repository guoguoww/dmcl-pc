
class socket {
    constructor(list,callback=()=>{}) {
        this.url= "wss://w.sinajs.cn/wskt?list="
        if (!list.length) return
        this.heartBeatTimer = null
        this.callback=callback
        const BrowserWebSocket = window.WebSocket || window.MozWebSocket
        const socket = new BrowserWebSocket(this.url+list)
        socket.onopen = evt => this.onopen(evt)
        socket.onclose = evt => this.onclose(evt)
        socket.onmessage = evt => this.onmessage(evt.data)
        socket.onerror = err => this.onerror(err)
        this.socket = socket
    }

    onopen(evt) {
        // console.log(this.socket);
        this.heartBeatTimer = setInterval(()=>{
            if (this.socket.readyState==1) {
                this.socket.send("")
            }
        }, 1000*52)
    }

    onmessage(data){        
        this.callback(data)
    }

    onclose(evt){
        console.log('websocket close',evt);
    }

    onerror(err){
        console.log('error',err);
    }

    close(){
        if (this.heartBeatTimer) {
            clearInterval(this.heartBeatTimer)
            this.heartBeatTimer = null
        }
        if (!this.socket) {
            return
        }
        this.socket.close()
        this.socket = null
    }

}
export default socket
