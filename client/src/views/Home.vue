<template>
  <div class="home">
    <div class='online-status'>В сети: {{onlineCount}}</div>
    <div class="chat" ref="chat">
      <Message v-for="msg of messages" :sender="msg.sender" :me="msg.sender === user" :key="msg.id" :msg="msg"></Message>
    </div>
    <form class="inputs" @submit.prevent="send">
      <input type="text" v-model.trim="input"/>
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<style>
.inputs{
  display: flex;
  width: 100%;
  gap: 10px;
}
.inputs input{
  padding: 5px 5px;
  width: 100%;
}

.inputs button{
  width: 120px;
}

.online-status{
  color: #fff;
}

.chat{
  max-height:60vh;
  overflow: auto;
  margin-bottom: 10px;
  scrollbar-width: thin;
}
::-webkit-scrollbar {
    height: 5px;
    width: 5px;
    background: #002137;
}

::-webkit-scrollbar-thumb {
    background: #002b75;
    cursor: pointer;
}

</style>

<script>
// @ is an alias to /src
import Message from '@/components/Message.vue';
import { v4 as uuidv4 } from 'uuid';
import SimpleCrypto from "simple-crypto-js"

export default {
  name: "Home",
  data(){
    return {
      ws: null,
      messages: {},
      input: '',
      lastId: '',
      user: null,
      needScroll: false,
      onlineCount: 0,
      simpleCrypto: new SimpleCrypto('super secret key'),
    }
  },
  components: {
    Message,
  },
  methods: {
    send(){
      this.lastId = uuidv4();
      const data = this.simpleCrypto.encrypt(JSON.stringify(
        {
          id: this.lastId,
          text: this.input,
          sender: this.user,
        }))
      this.input && this.ws.send(JSON.stringify({
        action: 'SEND',
        data,
      }))
      this.input = '';
    },
    scroll(){
      const el = this.$refs.chat;

      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }
  },
  updated(){
    if(this.needScroll){
      this.scroll()
      this.needScroll = false
    }
  },
  mounted(){
    this.messages = this.$store.getters.getMessages
    this.user = this.$store.getters.getUser
    if(!this.user){
      this.$store.commit('setUser', uuidv4())
      this.user = this.$store.state.userId
    }
    this.ws = new WebSocket('ws://localhost:9000');
    this.ws.onmessage = (data => {
      const parsed0 = JSON.parse(data.data);
      const parsed = {
        ...parsed0,
        data: (parsed0.data && parsed0.type !== 'online') ? this.simpleCrypto.decrypt(parsed0.data) : parsed0.data,
      }

      if(parsed.type === 'MESSAGE' && parsed.data.id){
        this.messages = {
          ...this.messages,
          [parsed.data.id]: parsed.data,
        };
      }
      if(parsed.type === 'REQUEST_MESSAGES'){
        this.ws.send(JSON.stringify({
          action: 'REQUEST_MESSAGES',
          data: this.simpleCrypto.encrypt(JSON.stringify({messageList: this.messages})),
        }))
      }
      if(parsed.type === 'MESSAGES'){
        this.messages = parsed.data.messageList
        this.needScroll = true
      }
      if(parsed.type === 'online'){
        this.onlineCount = parsed.data
      }
      if(Object.keys(this.messages).length > 50){
        const tmp = {}
        const keys = Object.keys(this.messages)
        for(let i = 1; i < keys.length; i++){
          tmp[keys[i]] = this.messages[keys[i]]
        }
        this.messages = tmp
      }
      this.$store.commit('setMessages', this.messages)
    })
  },
};
</script>
