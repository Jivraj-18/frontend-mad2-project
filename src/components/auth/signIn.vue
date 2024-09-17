<template>
    <form class="signin-form" @submit.prevent="signIn">
        <h1>Sign In</h1>
        <div class="form-group">
            <input type="email" id="email" placeholder="Email" class="input-field" v-model="formData.email" required>
        </div>
        <div class="form-group">
            <input type="password" id="password" placeholder="Password" class="input-field" v-model="formData.password" required>
        </div>
        <div class="form-group">
            <button type="submit" class="submit-button">Sign In</button>
            <button type="reset" class="clear-button">Clear form</button>
        </div>
    </form>
</template>

<script>

import axiosFetch from '../../axios'
export default {
    data() {
        return {
            formData: {
                email:'user@digilib',password:'12345678'
            }
        }
    },
    methods: {
        
        signIn() {
   
            axiosFetch.post('/api/signin/',this.formData).then(resp => {
                console.log(resp.data.user)
                
                if (resp.status == 200) {
                    this.$store.commit("setUser",resp.data)
                    localStorage.setItem('authToken',resp.data.access_token)    
                    console.log(this.$store)
                    if (resp.data.user.role == 0) {this.$router.push('/user/home')}
                    else {this.$router.push('/librarian/home')}
                    // this.$router.push('')
                    alert('Logged In')
                }
                
            }).catch(err => {
                if (err.response.status == 404 ){
                    alert('user does not exist')
                }   
                else if (err.response.status == 400) {
                    alert('email can\'t be blank')
                }             
                
            })
        }
    }
}
</script>


<style scoped>
.signin-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.input-field {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff; /* Blue color */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3; /* Darker shade of blue */
}

.clear-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #dc3545; /* Red color */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-button:hover {
  background-color: #c82333; /* Darker shade of red */
}
</style>
