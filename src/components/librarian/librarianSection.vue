<template>
    <div class="section-container">
      <div class="dropdown-container">
        <button @click="myFunction" class="dropbtn">{{ 'Select Section' }}</button>
        <button @click="showCreatePopup" class="dropbtn create-button">Create New Section</button>
      </div>
      <div id="myDropdown" class="dropdown-content">
        <input type="text" placeholder="Search.." id="myInput" v-model="searchQuery" @input="filterFunction">
      </div>
      
      <div class="table-container" v-if="filteredSuggestions.length">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="suggestion in filteredSuggestions" :key="suggestion.id">
              <td>{{ suggestion.name }}</td>
              <td>{{ suggestion.description }}</td>
              <td>
                <button @click="viewSection(suggestion.id)">View</button>
                <button @click="showEditPopup(suggestion)">Edit</button>
                <button @click="deleteSection(suggestion.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="upload-book">
        <div class="upload-overlay" v-if="isPopupVisible">
          <div class="upload-book-form">
            <span class="close" @click="hidePopup">&times;</span>
            <form @submit.prevent="handleSubmit(section)" class="upload-book-form">
              <h2>{{ isEditMode ? 'Edit Section' : 'Create New Section' }}</h2>
              <label for="book-name">Name</label>
              <input type="text" id="book-name" class="text-input" v-model="section.name" />
              <br>
              <label for="book-description">Description</label>
              <input type="text" id="book-description" class="text-input" v-model="section.description" />
              <br>
              <input type="file" id="book-file" class="file-input" @change="handleFileChange" />
              <br>
              <button type="submit" class="submit-button">Submit</button>
            </form>
            <button @click="hidePopup" class="close-button">Close</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import axiosFetch from "../../axios";

export default {
  mounted(){
    this.fetchSections('i');
  },
  data() {
    return {
      section: {
        name: '',
        description: '',
        file: null
      },
      suggestions: [],
      filteredSuggestions: [],
      searchQuery: '',
      isPopupVisible: false,
      isEditMode: false,
      currentSectionId: null
    };
  },
  methods: {
    fetchSections(query) {
      axiosFetch.get(`/api/search/section?query=${query}`).then(resp => {
        this.suggestions = resp.data;
        this.filteredSuggestions = this.suggestions;
      });
    },
    myFunction() {
      document.getElementById("myDropdown").classList.toggle("show");
    },
    filterFunction() {
      const query = this.searchQuery.trim() === '' ? 'i' : this.searchQuery;
      this.fetchSections(query);
    },
    showCreatePopup() {
      this.isEditMode = false;
      this.section = { name: '', description: '', file: null };
      this.isPopupVisible = true;
    },
    showEditPopup(suggestion) {
      this.isEditMode = true;
      this.currentSectionId = suggestion.id;
      this.section = { ...suggestion, file: null }; // Reset the file input
      this.isPopupVisible = true;
    },
    hidePopup() {
      this.isPopupVisible = false;
    },
    viewSection(id) {
      this.$router.push(`/librarian/section/${id}`);
    },
    deleteSection(id) {
      axiosFetch.delete(`/api/librarian/section/${id}`).then(() => {
        this.filteredSuggestions = this.filteredSuggestions.filter(suggestion => suggestion.id !== id);
      });
    },
    handleFileChange(event) {
      this.section.file = event.target.files[0];
    },
    handleSubmit(section) {
      const uploadData = new FormData();
      uploadData.append("name", section.name);
      uploadData.append("description", section.description);
      uploadData.append("section_image", section.file);
      
      if (this.isEditMode) {
        // Edit section
        axiosFetch.put(`/api/librarian/section/${this.currentSectionId}`, uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          this.updateSectionInList(this.currentSectionId, section);
          this.hidePopup();
        });
      } else {
        // Create new section
        axiosFetch.post(`/api/librarian/section`, uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          this.filteredSuggestions.push(resp.data);
          this.$router.push(`/librarian/section/${resp.data.id}`);
          this.hidePopup();
        });
      }
    },
    updateSectionInList(id, updatedSection) {
      const index = this.filteredSuggestions.findIndex(suggestion => suggestion.id === id);
      if (index !== -1) {
        this.filteredSuggestions[index] = { ...updatedSection, id };
      }
    }
  }
};
</script>

<style scoped>
.section-container {
  background-color: white;
  padding: 10px;
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

.create-button {
  margin-left: auto;
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

.table-container td button {
  margin: 0 5px;
}

.upload-book {
  margin-top: 20px;
  text-align: center;
}

.upload-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
</style>
    