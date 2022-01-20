<template>
  <div class="message" :class="me ? 'me' : ''">
    <div class="status">...{{msg.id.slice(25)}} > <span class='sender'>{{me ? ' You' : 'Anon'}}</span></div>
    {{msg.text}}
  </div>
</template>

<style>
.message{
  padding: 5px 10px;
  background: #acafcf;
  margin: 5px 0;
}
.me{
  background: #bbb;
}
.status{
  font-size:12px;
  border-bottom: 1px solid;
}
.status .sender{
  color: green;
}
</style>

<script>
export default {
  name: "Message",
  props: ['msg', 'sender', 'me',],
};
</script>
