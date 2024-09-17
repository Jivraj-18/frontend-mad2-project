<template>
    <appHeader :toggleSideBar="toggleSideBar"/>
    <div id='main'>
        <contentSidebar v-if="sidebar"/>
        <div class='body'> <router-view/> </div>
    </div>

</template>


<script>
import contentSidebar from "@/components/sideBar/content-sidebar.vue"
import appHeader from "@/components/header/appHeader.vue"
export default {
    components: {
        contentSidebar, appHeader
    },
    data() {
        return {
            sidebar : true,

        }
    },
    methods: {
        toggleSideBar(){
            this.sidebar = !this.sidebar
            console.log(this.sidebar);
        } 
    }
}

</script>

<style>
#main {
background-color: lightgreen;
display: flex;
height: calc(100% - 60px);
}
.body {
overflow: auto; padding: 10px;
width: 100%;
}
</style>