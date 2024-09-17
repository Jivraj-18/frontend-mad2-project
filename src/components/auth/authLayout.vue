<template>
    <header class="header">
        <!-- Logo -->
        <div class="logo-container">
            <img class="logo" :src="require('@/assets/logo1.png')" alt="Logo" />
        </div>
        <!-- Links -->
        <div class="links">
        <!-- Signup link -->
        <div class="link">
            <router-link :to="{ name: 'signUp' }">Sign up</router-link>
        </div>
        <!-- Signin link -->
        <div class="link">
            <router-link :to="{ name: 'signIn' }">Sign In</router-link>
        </div>
        </div>
  </header>
  <main>
    <router-view/>
  </main>
</template>

<script>
</script>


<style scoped>
   .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    }

    .logo-container {
    margin-right: 20px;
    }

    .logo {
    width: 150px;
    height: 77px; /* Adjust size as needed */
    }

    .links {
    display: flex;
    }

    .link {
    margin-left: 10px; /* Adjust spacing between links */
    }

    .link a {
    text-decoration: none;
    color: #333; /* Adjust color as needed */
    font-weight: bold;
    }

    .link a:hover {
    color: white; /* Adjust hover color as needed */
    }
    * {
        padding: 0; margin: 0;
        box-sizing: box-border;
    }
</style>