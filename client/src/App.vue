<template>
  <div id="app">
    <div class="wrapper">
      <div id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
      </div>
      <router-view />
    </div>
  </div>
</template>

<style>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: system-ui;
}
#app{
  background: #002137;
}
.wrapper{
  max-width: 500px;
  margin: 0 auto;
  height: 100vh;
}
#nav{
  display:flex;
  gap: 20px;
  width: fit-content;
  margin: 0 auto;
  margin-bottom: 10px;
  padding-top: 10px;
}
#nav a{
  text-decoration: none;
  color: white;
  text-transform: uppercase;
}
</style>