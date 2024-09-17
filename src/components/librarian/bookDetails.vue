<template>
  <div class="book-details">
    <div class="book-header">
      <img class="book-image" :src="`http://127.0.0.1:5000/static/images/book/${book.id}.png`" alt="Book image">
      <div class="book-info">
        <h1>{{ book.name }}</h1>
        <p>{{ book.author }}</p>
        <p>{{ book.rating }}</p>
        <div class="book-actions">
          <button @click="showPopup" class="edit-button">Edit</button>
          <button @click="deleteBook(book.id)" class="delete-button">Delete</button>
          <button @click="readBook(book.id)" class="read-button">Read</button>
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

    <!-- Edit Book Popup -->
    <div class="edit-popup" v-if="isPopupVisible">
      <div class="edit-popup-content">
        <span class="close" @click="hidePopup">&times;</span>
        <h2>Edit Book</h2>
        <form @submit.prevent="submitForm">
          <label for="book-name">Name</label>
          <input type="text" id="book-name" v-model="uploadData.name" />

          <label for="book-description">Description</label>
          <textarea id="book-description" v-model="uploadData.description"></textarea>

          <label for="book-author">Author</label>
          <input type="text" id="book-author" v-model="uploadData.author" />

          <label for="book-file">Change Book PDF</label>
          <input type="file" id="book-file" @change="handleFileChange" />

          <button type="submit" class="submit-button">Submit</button>
        </form>
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
      isPopupVisible: false,
      uploadData: {
        name: '',
        description: '',
        author: '',
        file: null
      },
      reviews: [],
    };
  },
  mounted() {
    const bookId = this.$route.params.id;

    // Fetch book details
    axiosFetch.get(`/api/librarian/book/${bookId}`).then((response) => {
      this.book = response.data;
      this.uploadData.name = response.data.name;
      this.uploadData.author = response.data.author;
      this.uploadData.description = response.data.description;
    });

    // Fetch reviews
    axiosFetch.get(`/api/book/${bookId}/feedbacks`).then((response) => {
      this.reviews = response.data;
    });
  },
  methods: {
    deleteBook(book_id) {
      axiosFetch.delete(`/api/librarian/book/${book_id}`).then(() => {
        alert("Delete Successfully");
        this.$router.push('/librarian/books'); // Redirect to a blank page
      });
    },
    readBook(book_id) {
      this.$router.push(`/librarian/book/${book_id}/read`);
    },
    showPopup() {
      this.isPopupVisible = true;
    },
    hidePopup() {
      this.isPopupVisible = false;
    },
    handleFileChange(event) {
      this.uploadData.file = event.target.files[0];
    },
    async submitForm() {
      const uploadData = new FormData();
      uploadData.append('name', this.uploadData.name);
      uploadData.append('description', this.uploadData.description);
      uploadData.append('author', this.uploadData.author);
      if (this.uploadData.file) {
        uploadData.append('book_pdf', this.uploadData.file);
        uploadData.append('change_pdf', 1);
      }

      await axiosFetch.put(`/api/librarian/book/${this.book.id}`, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      this.hidePopup();
      window.location.reload();
    }
  }
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

.edit-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #ddd;
  padding: 20px;
  z-index: 1000;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  width: 400px;
}

.edit-popup-content {
  position: relative;
}

.edit-popup-content .close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.submit-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
}
</style>
