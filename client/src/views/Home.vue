<template>
  <div class="home">
    <div class="chat">
      <Message v-for="msg of messages" :sender="msg.sender" :me="msg.sender === user" :key="msg.id" :msg="msg"></Message>
    </div>
    <div class="inputs">
      <input type="text" v-model="input"/>
      <button @click="send">Send</button>
    </div>
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
</style>

<script>
// @ is an alias to /src
import Message from '@/components/Message.vue';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "Home",
  data(){
    return {
      ws: null,
      messages: {},
      input: '',
      lastId: '',
      user: null,
    }
  },
  components: {
    Message,
  },
  methods: {
    send(){
      this.lastId = uuidv4();
      this.input && this.ws.send(JSON.stringify({
        action: 'SEND',
        data: {
          id: this.lastId,
          text: this.input,
          sender: this.user,
        },
      }))
      this.input = '';
    },
  },
  mounted(){
    this.messages = JSON.parse(sessionStorage.getItem('messages') || '{}')
    const userId = JSON.parse(sessionStorage.getItem('user') || 'null')
    if(userId){
      this.user = userId
    } else {
      this.user = uuidv4()
        sessionStorage.setItem('user', JSON.stringify(this.user))
    }
    this.ws = new WebSocket('ws://localhost:9000');
    this.ws.onmessage = (data => {
      const parsed = JSON.parse(data.data);
      if(parsed.type === 'MESSAGE'){
        this.messages = {
          ...this.messages,
          [parsed.data.id]: parsed.data,
        };
        sessionStorage.setItem('messages', JSON.stringify(this.messages))
      }
    })
  },
};
</script>
