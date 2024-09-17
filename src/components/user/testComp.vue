<template>
    <div>
      <div class="placeholder" :style="{ height: placeholderHeight + 'px' }"></div>
      <div class="sticky-element" :class="{ 'is-sticky': isSticky }">
        <!-- Your sticky element content -->
        <div class="grid-container">
            <div class="book-grid">Book</div>
            <div class="description-grid">description</div>
            <div class="image-grid">
                <img class="image-grid" :src="`http://127.0.0.1:5000/static/images/book/1.png`" />
            </div>
            <div class="feedback-grid">Feedback</div>
            <!-- <div class="pdf-grid">PDF</div> -->
            <object class="pdf-grid" :data="`http://127.0.0.1:5000/static/pdfs/1.pdf`" ></object>
          </div>
      </div>
      <!-- Rest of your content -->
    </div>
  </template>

  <script>
export default {
  data() {
    return {
      isSticky: false,
      placeholderHeight: 0
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    // Calculate placeholder height initially
    this.calculatePlaceholderHeight();
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      // Get the scroll position
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

      // Toggle the isSticky property based on scroll position
      this.isSticky = scrollPosition > /* your trigger scroll position */

      // Update placeholder height if needed
      this.calculatePlaceholderHeight();
    },
    calculatePlaceholderHeight() {
      // Get the height of the sticky element
      const stickyElement = this.$el.querySelector('.sticky-element');
      if (stickyElement) {
        this.placeholderHeight = stickyElement.offsetHeight;
      }
    }
  }
};

</script>

<style scoped>
.sticky-element {
    /* Your styles for the sticky element */
  }
  
  .is-sticky {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    /* Additional styles for the sticky element when it becomes sticky */
  }
  
  .placeholder {
    /* Height equal to the height of the sticky element */
  }
  .grid-container {
    display: grid;
    grid-template-columns: 300px auto;
    background-color: #2196F3;
    padding: 10px;
    width: 100%;
  }
  .book-grid {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.8);
    padding: 20px;
    font-size: 30px;
    text-align: center;
  }
  .description-grid {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.8);
    padding: 20px;
    font-size: 30px;
    text-align: center;
    grid-area: calc(1,2);
  }
  .image-grid {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.8);
    font-size: 30px;
    text-align: center;
    width: 300px;
    object-fit: cover;
  }
  .feedback-grid {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.8);
    padding: 20px;
    font-size: 30px;
    text-align: center;
  }
  .pdf-grid {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.8);
    padding: 20px;
    font-size: 30px;
    text-align: center;
    grid-column: 1/ span 1;
    width: 100%;
    height: 1000px;
  }
</style>