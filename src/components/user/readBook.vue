<template>
  <div class="book-details">
    <div class="book-header">
      <img class="book-image" :src="`http://127.0.0.1:5000/static/images/book/${book.id}.png`" alt="Book image">
      <div class="book-info">
        <h1>{{ book.name }}</h1>
        <p>{{ book.author }}</p>
        <p>{{ book.rating }}</p>
        <div class="book-actions">
          <button @click="readBook(book.id)" class="read-button">Read</button>
          <button @click="requestBook(book.id)" class="request-button">Request</button>
        </div>
      </div>
    </div>

    <div class="book-description">
      <h2>Description</h2>
      <p>{{ book.description }}</p>
    </div>

    <div class="book-reviews">
      <h2>Reviews</h2>
      <div class="review-item" v-for="review in reviews" :key="review.id">
        <p>User: {{ review.user_details.email }}</p>
        <div class="review-rating">
          <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.rating }">★</span>
        </div>
        <p>{{ review.rating_description }}</p>
      </div>
    </div>
  </div>
</template>


  
<script>
import axiosFetch from '../../axios';

export default {
  data() {
    return {
      book: {},
      reviews: [],
    };
  },
  mounted() {
    const bookId = this.$route.params.id;

    // Fetch book details
    axiosFetch.get(`/api/librarian/book/${bookId}`).then((response) => {
      this.book = response.data;
    });

    // Fetch reviews
    axiosFetch.get(`/api/book/${bookId}/feedbacks`).then((response) => {
      this.reviews = response.data;
    });
  },
  methods: {
    readBook(bookId) {
      this.$router.push(`/librarian/book/${bookId}/read`);
    },
    requestBook(bookId) {
      // Check the current status of the book
      axiosFetch.get(`/api/user/status/${bookId}`).then((statusResponse) => {
        const status = statusResponse.data.status;

        if (status === 1) {
          alert('You already have access to this book.');
        } else if (status === 0) {
          alert('Your request is pending.');
        } else {
          // If the book is not accepted or pending, check if the user can request more books
          axiosFetch.get('/api/user/can_request').then((requestResponse) => {
            if (requestResponse.data) {
              axiosFetch.post(`/api/user/book/${bookId}/request`).then(() => {
                alert('Request sent successfully!');
              }).catch(() => {
                alert('Failed to send request.');
              });
            } else {
              alert('You can\'t request more books.');
            }
          }).catch(() => {
            alert('Failed to check request status.');
          });
        }
      }).catch(() => {
        alert('Failed to check book status.');
      });
    },
  },
};
</script>


  
  <style scoped>
  .book-details {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .book-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .book-image {
    max-width: 150px;
    margin-right: 20px;
    border-radius: 8px;
  }
  
  .book-info {
    flex-grow: 1;
  }
  
  .book-info h1 {
    margin: 0 0 10px;
    font-size: 24px;
  }
  
  .book-info p {
    margin: 0 0 10px;
    color: white;
  }
  
  .book-actions button {
    margin-right: 10px;
  }
  
  .book-description {
    margin-bottom: 20px;
  }
  
  .book-description h2 {
    margin-bottom: 10px;
  }
  
  .book-reviews {
    margin-bottom: 20px;
  }
  
  .book-reviews h2 {
    margin-bottom: 10px;
  }
  
  .review-item {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .review-rating {
    margin-bottom: 5px;
  }
  
  .star {
    color: #ccc;
  }
  
  .star.filled {
    color: #ffcc00;
  }
  
 
  </style>
  