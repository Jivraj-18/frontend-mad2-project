<template>
  <form class="signup-form" @submit.prevent="signUp">
    <h1>Sign Up</h1>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="Email" v-model="formData.email" required>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" placeholder="Password" v-model="formData.password" required>
    </div>
    <div class="form-group">
      <label for="username">Name</label>
      <input type="text" id="username" placeholder="Name" v-model="formData.username" required>
    </div>
    <button type="submit" class="">Create Account</button>
    <button type="reset" class="reset-button">Reset Form</button>
  </form>
</template>
<script>

import axiosFetch from '../../axios'
export default {
    data() {
        return {
            formData: {
                email:'user@digilib',password:'12345678',username:'user'
            }
        }
    },
    methods: {
        signUp() {
            
            axiosFetch.post('/api/signup/',this.formData).then(resp => {
                // console.log(resp.status)
                
                if (resp.status == 201) {
                    alert('Account Created!')
                }
                
            }).catch(err => {
                if (err.response.status == 409 ){
                    alert('Account Already Exists!')
                }   
                else if (err.response.status == 400) {
                    alert('User name or email can\'t be blank')
                }             
                
            })
        }
    }
}
</script>
<style scoped>
.signup-form {
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

label {
  display: block;
  font-weight: bold;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
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

button:hover {
  background-color: #0056b3; /* Darker shade of blue */
}

.reset-button {
  background-color: red; /* Red color for reset button */
  margin-top: 10px;
}

.reset-button:hover {
  background-color: #c82333; /* Darker shade of red */
}
</style>

