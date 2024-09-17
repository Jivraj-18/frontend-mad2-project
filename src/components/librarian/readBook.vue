<template>
    <object class="pdf-grid" :data="pdfUrl" type="application/pdf"></object>
</template>

<script>
export default {
    computed: {
        pdfUrl() {
            return `http://127.0.0.1:5000/static/pdfs/${this.$route.params.book_id}.pdf`
        }
    }
}
</script>

<style scoped>
.pdf-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>