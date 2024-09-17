<template>
  <div class="section-container" style="background-color: white;">
    <div class="dropdown-container">
      <button @click="myFunction" class="dropbtn">{{ 'Select Section' }}</button>
    </div>
    <div id="myDropdown" class="dropdown-content">
      <input type="text" placeholder="Search.." id="myInput" v-model="searchQuery" @input="filterFunction">
    </div>
    
    <div class="sections-scrollable">
      <div class="table-container" v-if="filteredSuggestions.length">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="suggestion in filteredSuggestions" :key="suggestion.id">
              <td @click="fetchBooks(suggestion.id, suggestion.name)" class="section-name">{{ suggestion.name }}</td>
              <td>{{ suggestion.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="books-container" v-if="books.length">
      <h3>Books in {{currentSectionName}}</h3>
      <div class="books-scrollable">
        <table>
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id">
              <td>{{ book.name }}</td>
              <td>{{ book.description }}</td>
              <td>
                <button @click="viewBook(book.id)">View</button>
                <button @click="requestAccess(book.id)">Request Access</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axiosFetch from "../../axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // Import useRouter

export default {
  setup() {
    const router = useRouter(); // Assign router instance
    const section = ref({
      name: '',
      description: '',
      file: null
    });
    const suggestions = ref([]);
    const filteredSuggestions = ref([]);
    const books = ref([]);
    const searchQuery = ref('');
    const currentSectionId = ref(null);
    const currentSectionName = ref('');

    const fetchSections = (query) => {
      axiosFetch.get(`/api/search/section?query=${query}`).then(resp => {
        suggestions.value = resp.data;
        filteredSuggestions.value = suggestions.value;
      });
    };

    const myFunction = () => {
      document.getElementById("myDropdown").classList.toggle("show");
    };

    const filterFunction = () => {
      const query = searchQuery.value.trim() === '' ? 'i' : searchQuery.value;
      fetchSections(query);
    };

    const fetchBooks = (sectionId, sectionName) => {
      currentSectionId.value = sectionId;
      currentSectionName.value = sectionName;
      axiosFetch.get(`/api/user/section/${sectionId}/books`).then(resp => {
        books.value = resp.data;
      });
    };

    const viewBook = (bookId) => {
      router.push(`/user/book/${bookId}`); // Use router instance to navigate
    };

    const requestAccess = (bookId) => {
      axiosFetch.get(`/api/user/can_request`).then(resp => {
        if (resp.data === true) {
          axiosFetch.post(`/api/user/book/${bookId}/request`).then(() => {
            // Show success message
            alert("Request sent successfully!");
          });
        } else {
          // Show error message
          alert("You can't send more requests.");
        }
      });
    };

    onMounted(() => {
      fetchSections('i');
    });

    return {
      section,
      suggestions,
      filteredSuggestions,
      books,
      searchQuery,
      currentSectionId,
      currentSectionName,
      fetchSections,
      myFunction,
      filterFunction,
      fetchBooks,
      viewBook,
      requestAccess
    };
  }
};
</script>


<style scoped>
.section-container {
  background-color: white;
  padding: 10px;
  max-width: 100%;
}

.dropdown-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropbtn {
  background-color: #04AA6D;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* Dropdown button on hover & focus */
.dropbtn:hover,
.dropbtn:focus {
  background-color: #3e8e41;
}

/* The search field */
#myInput {
  box-sizing: border-box;
  background-position: 14px 12px;
  background-repeat: no-repeat;
  font-size: 16px;
  padding: 14px 20px 12px 45px;
  border: none;
  border-bottom: 1px solid #ddd;
}

/* The search field when it gets focus/clicked on */
#myInput:focus {
  outline: 3px solid #ddd;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f6f6f6;
  min-width: 230px;
  border: 1px solid #ddd;
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background-color: #f1f1f1;
}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
  display: block;
}

.sections-scrollable {
  max-height: 300px; /* Adjust as needed */
  overflow-y: auto;
}

.table-container {
  margin-top: 20px;
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
}

.table-container th,
.table-container td {
  padding: 10px;
  border: 1px solid #ddd;
}

.table-container th {
  background-color: #f2f2f2;
}

.table-container td {
  cursor: pointer;
}

.books-container {
  margin-top: 20px;
}

.books-scrollable {
  max-height: 300px; /* Adjust as needed */
  overflow-y: auto;
}

.books-container table {
  width: 100%;
  border-collapse: collapse;
}

.books-container th,
.books-container td {
  padding: 10px;
  border: 1px solid #ddd;
}

.books-container th {
  background-color: #f2f2f2;
}

.books-container td button {
  margin: 0 5px;
}
</style>
