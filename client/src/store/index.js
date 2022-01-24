import Vuex from 'vuex';
import Vue from "vue";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    messages: {},
    userId: null,
  },
  mutations: {
    setMessages(state, data){
      state.messages = data
    },
    setUser(state, uuid){
      state.userId = uuid
    }
  },
  getters: {
    getMessages(state){
      return state.messages
    },
    getUser(state){
      return state.userId
    },
  }

})