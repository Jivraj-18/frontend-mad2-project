<template>
    <appHeader/>
    <div id='main'>
        <contentSidebar/>
        <div class='body'> <router-view/> </div>
    </div>

</template>


<script>
import contentSidebar from "@/components/sideBar/content-sidebar-librarian.vue"
import appHeader from "@/components/header/appHeader.vue"
export default {
    components: {
        contentSidebar, appHeader
    },
    data() {
        return {

        }
    },
    methods: {

    }
}

</script>

<style>
#main {
background-color: white;
display: flex;
height: calc(100% - 60px);
}
.body {
overflow: auto; padding: 10px;
width: 100%;
}
</style>