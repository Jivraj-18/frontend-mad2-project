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
  
      <!-- Search Box -->
      <div class="search-box">
        <label for="search">Search by User:</label>
        <input type="text" v-model="searchQuery" @input="filterTables" placeholder="Enter user email..." />
      </div>
  
      <div v-for="(table, status) in filteredTables" :key="status" class="table-container">
        <h2>{{ getStatusText(Number(status)) }} Books</h2>
        <table v-if="table.length">
          <thead>
            <tr>
              <th>Name</th>
              <th>Author</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in table" :key="book.id">
              <td>{{ book.book_details.name }}</td>
              <td>{{ book.book_details.author }}</td>
              <td>{{ book.user_details.email }}</td>
              <td>
                <button v-if="status === '1'" @click="revokeBook(book.book_details.id, book.user_id)">Revoke</button>
                <button v-else-if="status === '0'" @click="acceptRequest(book.book_details.id, book.user_id)">Accept</button>
                <button v-else disabled>Not applicable</button>
                <button v-if="status === '0'" @click="rejectRequest(book.book_details.id, book.user_id)">Reject</button>
                
              </td>
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
        selectedStatus: 'all', // Dropdown default value
        searchQuery: '' // Search query for user email
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
        let filteredBooks = this.books;
  
        // Filter by status
        if (this.selectedStatus !== 'all') {
          filteredBooks = filteredBooks.filter(book => String(book.status) === this.selectedStatus);
        }
  
        // Filter by search query
        if (this.searchQuery) {
          filteredBooks = filteredBooks.filter(book =>
            book.user_details.email.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        }
  
        // Group filtered books by status
        return filteredBooks.reduce((acc, book) => {
          const status = String(book.status);
          if (!acc[status]) {
            acc[status] = [];
          }
          acc[status].push(book);
          return acc;
        }, {});
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
        axiosFetch.get("/api/librarian/book/issue")
          .then(response => {
            this.books = response.data;
          })
          .catch(error => {
            console.error("There was an error fetching the books:", error);
          });
      },
      updateBookStatus(bookId, userId, status) {
        axiosFetch.put(`/api/librarian/book/${bookId}/issue/${userId}`, { status })
          .then(() => {
            // Update the book status locally after the request is successful
            this.books = this.books.map(book =>
              book.book_details.id === bookId && book.user_id === userId ? { ...book, status } : book
            );
          })
          .catch(error => {
            console.error("There was an error updating the book status:", error);
          });
      },
      acceptRequest(bookId, userId) {
        this.updateBookStatus(bookId, userId, 1);
      },
      rejectRequest(bookId, userId) {
        this.updateBookStatus(bookId, userId, 2);
      },
      revokeBook(bookId, userId) {
        this.updateBookStatus(bookId, userId, 4);
      }
    }
  };
  </script>
  
  <style scoped>
  .table-container {
    margin-top: 20px;
    overflow-x: auto; /* Allows horizontal scrolling if needed */
    max-height: 300px; /* Adjust the height as needed */
    overflow-y: auto; /* Enables vertical scrolling */
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
  
  .dropdown, .search-box {
    margin-bottom: 20px;
  }
  </style>
  