<template>
  <div class="sidebar" v-if="this.$store.state.user.role === 'user'">

  
    <router-link to="/user/home">Home</router-link>
    <router-link to="/user/books">Books</router-link>
    <router-link to="/user/sections">Sections</router-link>
    <router-link to="/user/history">Requests</router-link>
  
  </div>
</template>

<script>
</script>

<style scoped>
.sidebar {
  display: flex; flex-direction: column; justify-content: space-evenly;
  width: max-content;
  background-color: bisque;
  padding: 0px;
}
.router-link {
  display: block;
  margin-bottom: 10px;
  color: #333;
  text-decoration: none;
}
.sidebar > a {
padding: 0 10px;
}
</style>
