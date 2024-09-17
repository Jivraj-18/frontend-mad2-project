<template>
  <div class="upload-book">
    <button @click="showPopup" class="upload-button">Upload</button>
    <div class="upload-overlay" v-if="isPopupVisible">
      <div class="upload-book-form">
        <span class="close" @click="hidePopup">&times;</span>
        
        <form @submit.prevent="submitForm" class="upload-book-form">
          <span class="close" @click="hidePopup">&times;</span>
          <h2>Upload Form</h2>
          <label for="book-name">Name</label>
          <input type="text" id="book-name" class="text-input" v-model="uploadData.name" />
          <br>
          <label for="book-description">Description</label>
          <input type="text" id="book-description" class="text-input" v-model="uploadData.description" />
          <br>
          <label for="book-author">Author</label>
          <input type="text" id="book-author" class="text-input" v-model="uploadData.author" />
          <br>
          <input type="file" id="book-file" class="file-input" @change="handleFileChange" />
          <br>
          <button type="submit" class="submit-button">Submit</button>
        </form>
        <button @click="hidePopup" class="close-button">Close</button>
      </div>
    </div>
  </div>

  <div class="books-list" style="background-color: white;">
    <table>
      <thead>
        <tr>
          <th>Book Name</th>
          <th>Description</th>
          <th>Author</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.name }}</td>
          <td>{{ book.description }}</td>
          <td>{{ book.author }}</td>
          <td>
            <button @click="viewBook(book.id)" class="view-button">View</button>
            <button @click="confirmDeleteBook(book)" class="delete-button">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axiosFetch from "../../axios";
export default {
  data() {
    return {
      isPopupVisible: false,
      books: [],
      uploadData: {
        name: '',
        description: '',
        author: '',
        file: null
      }
    };
  },
  mounted() {
    axiosFetch
      .get("/api/user/books")
      .then(
        (resp) => {
          this.books = resp.data;
        },
        (error) => {
          console.log(error);
        }
      );
  },
  methods: {
    confirmDeleteBook(book) {
            if (confirm(`Are you sure you want to delete the book "${book.name}"?`)) {
                this.deleteBook(book);
            }
        },
    
      async viewBook(bookId) {
        try {
          // Implement your logic to view book details
          // For example, navigate to the book details page
          this.$router.push(`/librarian/book/${bookId}`);
        } catch (error) {
          console.error("Error viewing book:", error);
        }
      },
    bookdetails(book) {
      this.$router.push(`/librarian/book/${book.id}`)
      console.log(book)
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
      uploadData.append('book_pdf', this.uploadData.file);

      const response = await axiosFetch.post('/api/librarian/book', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload successful!', response.data);

      // Add the new book to the top of the books array
      this.books.unshift(response.data);

      this.hidePopup();
    },
    deleteBook(book) {
      axiosFetch.delete(`/api/librarian/book/${book.id}`).then(resp => {
        console.log(resp)
        this.books = this.books.filter(b => b.id !== book.id);
      }).catch(err => {
        console.error(err);
      });
    }
  }
};
</script>

<style scoped>
.upload-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.upload-button:hover {
  background-color: #0056b3;
}

.upload-book {
  text-align: center;
}

.upload-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(199, 122, 122, 0.444);
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-book-form {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

.file-input {
  margin-bottom: 10px;
}

.close-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #c82333;
}

.book-item {
  width: 1200px; /* Set width */
  height: 100px; /* Set height */
  background-color: #f0f0f0; /* Background color */
  border: 1px solid #ccc; /* Border */
  border-radius: 5px; /* Border radius for rounded corners */
  padding: 20px; /* Padding inside the box */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Box shadow for a subtle effect */
  display: flex;
  gap: 30px
}

/* CSS for content inside the rectangular box */
.book-item h2 {
  margin-top: 0; /* Remove default margin for heading */
}

.book-item p {
  margin-bottom: 0; /* Remove default margin for paragraph */
}

.book-item:hover {
  background-color: rgb(97, 97, 129); /* Change background color on hover */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}

.view-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.view-button:hover {
  background-color: #218838;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c82333;
}
</style>
