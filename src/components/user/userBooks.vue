<template>
    <div class="books-list">
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
      
      
        async viewBook(bookId) {
          try {
            // Implement your logic to view book details
            // For example, navigate to the book details page
            this.$router.push(`/user/book/${bookId}`);
          } catch (error) {
            console.error("Error viewing book:", error);
          }
        },
      bookdetails(book) {
        this.$router.push(`/librarian/book/${book.id}`)
        console.log(book)
      }
      
  
      
    }
  };
  </script>
  
  <style scoped>
    
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
  
  
  </style>
  