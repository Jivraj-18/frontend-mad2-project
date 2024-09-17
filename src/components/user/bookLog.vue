<template>
  <div>
    <h1>Book History</h1>

    <!-- Dropdown Menu -->
    <div class="dropdown">
      <label for="status">Select Status:</label>
      <select v-model="selectedStatus" @change="filterTables">
        <option value="all">All</option>
        <option value="0">Pending</option>
        <option value="1">Accepted</option>
        <option value="2">Rejected</option>
        <option value="3">Returned</option>
        <option value="4">Revoked</option>
      </select>
    </div>

    <div v-for="(table, status) in filteredTables" :key="status" class="table-container">
      <h2>{{ getStatusText(Number(status)) }} Books</h2>
      <table v-if="table.length">
        <thead>
          <tr>
            <th>Name</th>
            <th>Author</th>
            <th>Rating</th>
            <th>Description</th>
            <th>Actions</th>
            <th>Rate</th>
            <th v-if="previously_read">Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in table" :key="book.id">
            <td>{{ book.book_details.name }}</td>
            <td>{{ book.book_details.author }}</td>
            <td>{{ book.rating }} / 5</td>
            <td>{{ book.rating_description }}</td>
            <td>
              <button v-if="status === '1'" @click="returnBook(book.book_details.id)">Return</button>
              <button v-else-if="status === '0'" @click="cancelRequest(book.book_details.id)">Cancel Request</button>
              <button v-else @click="requestBook(book)">Request</button>
            </td>
            <td v-if="book.previously_read">
              <button @click="rateBook(book)">Rate Book</button>
            </td>
            <td v-else style="color: red;">Can't Rate</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup for Rating -->
    <div class="popup" v-if="showPopup">
      <div class="popup-content">
        <span class="close" @click="closePopup">&times;</span>
        <h1>{{ popup.book_details.name }}</h1>
        <div>
          <label for="rating">Rating:</label>
          <input type="number" v-model="popup.rating" min="1" max="5" />
        </div>
        <div>
          <label for="rating_description">Description:</label>
          <textarea v-model="popup.rating_description"></textarea>
        </div>
        <button @click="submitRating(popup.book_details.id)">Submit Rating</button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosFetch from '../../axios';

export default {
  data() {
    return {
      books: [],
      showPopup: false,
      popup: {
        book_details: {},
        rating: '',
        rating_description: ''
      },
      previously_read: false, // Replace with actual condition
      selectedStatus: 'all' // Dropdown default value
    };
  },
  computed: {
    tables() {
      return this.books.reduce((acc, book) => {
        const status = String(book.status); // Convert status to string
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(book);
        return acc;
      }, {});
    },
    filteredTables() {
      if (this.selectedStatus === 'all') {
        return this.tables;
      }
      return { [this.selectedStatus]: this.tables[this.selectedStatus] || [] };
    }
  },
  mounted() {
    this.fetchBooks();
  },
  methods: {
    getStatusText(status) {
      switch (status) {
        case 0:
          return 'Pending';
        case 1:
          return 'Accepted';
        case 2:
          return 'Rejected';
        case 3:
          return 'Returned';
        case 4:
          return 'Revoked';
        default:
          return '';
      }
    },
    fetchBooks() {
      axiosFetch.get("/api/user/history/book")
        .then(response => {
          this.books = response.data;
        })
        .catch(error => {
          console.error("There was an error fetching the books:", error);
        });
    },
    returnBook(book_id) {
      axiosFetch.delete(`/api/user/book/${book_id}/request`)
        .then(() => {
          this.books = this.books.map(book =>
            book.book_details.id === book_id ? { ...book, status: 3 } : book
          );
        })
        .catch(error => {
          console.error("There was an error returning the book:", error);
        });
    },
    requestBook(book) {
      axiosFetch.get('/api/user/can_request').then(response => {
        if (response.data === true) {
          axiosFetch.post(`/api/user/book/${book.book_details.id}/request`).then(() => {
            book.status = 0; // Update status to Pending
          });
        } else {
          alert("You can't request more books at this time.");
        }
      });
    },
    cancelRequest(book_id) {
      axiosFetch.delete(`/api/user/book/${book_id}/request`)
        .then(() => {
          this.books = this.books.map(book =>
            book.book_details.id === book_id ? { ...book, status: 4 } : book
          );
        })
        .catch(error => {
          console.error("There was an error canceling the request:", error);
        });
    },
    rateBook(book) {
      axiosFetch.get(`/api/user/book/${book.book_details.id}/feedback`).then(response => {
        if (response.data) {
          this.popup.rating = response.data.rating;
          this.popup.rating_description = response.data.rating_description;
        } else {
          this.popup.rating = '';
          this.popup.rating_description = '';
        }
        this.popup.book_details = book.book_details;
        this.showPopup = true;
      });
    },
    closePopup() {
      this.showPopup = false;
    },
    submitRating(bookId) {
      const url = `/api/user/book/${bookId}/feedback`;
      const method = this.popup.rating ? 'put' : 'post';
      axiosFetch[method](url, {
        rating: this.popup.rating,
        rating_description: this.popup.rating_description
      }).then(() => {
        this.showPopup = false;
      });
    },
    filterTables() {
      // This method can be empty since filteredTables is automatically updated
    }
  }
};
</script>

<style scoped>
.table-container {
  margin-top: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background-color: #f2f2f2;
  padding: 10px;
  border: 1px solid #ddd;
}

tbody td {
  padding: 10px;
  border: 1px solid #ddd;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #ddd;
  z-index: 1000;
}

.popup-content {
  padding: 20px;
}

.close {
  float: right;
  font-size: 20px;
  cursor: pointer;
}

.dropdown {
  margin-bottom: 20px;
}
</style>
