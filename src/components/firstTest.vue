<template>
    <h2>checking router</h2>
</template>

<script>

import axiosFetch from '../axios.js'
    export default {
        name: "CheckingRouter",
        data() {
            return {
                message: "checking router"
            }
        },

        created() {
            console.log("created")
            console.log(this.$store.state)
        
        axiosFetch.get('https://pokeapi.co/api/v2/pokemon/pikachu').then(resp => {
                console.log(resp)             
                
            }).catch(err => {
                console.log(err)
            })




        }

        

    }

</script>
