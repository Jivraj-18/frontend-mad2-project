<template>
    <div id='header'>
        <div class='header-first'>
            <svg @click="toggleSideBar" width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 8H13.75M5 12H19M10.25 16L19 16" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h1 id='logo'>E-Book</h1>
        </div>
        <div class='header-center'>
            <form @submit.prevent="performSearch">
                <input v-model="searchQuery" type='search' placeholder="Search...">
                <select v-model="searchFilter" @change="updateColumnOptions">
                    <option value="book">Book</option>
                    <option value="section">Section</option>
                </select>
                <select v-model="searchColumn">
                    <option v-for="option in columnOptions" :key="option" :value="option">{{ option }}</option>
                </select>
                <button type="submit">Search</button>
            </form>
        </div>
        <div class='header-end'>
            <img class="user-logo" :src="require('@/assets/logo1.png')" alt="Logo" />
            <button @click="handleLogout">Logout</button>
        </div>
        <!-- Search Modal -->
        <div class="modal" v-if="isModalVisible">
            <div class="modal-content">
                <span class="close" @click="isModalVisible = false">&times;</span>
                <h2>Search Results</h2>
                <ul>
                    <li v-for="item in searchResults" :key="item.id">
                        {{ item.name }} - {{ item.description }} ({{ item.author || item.section_name }})
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import axiosFetch from '../../axios'; // Adjust the path as needed

export default {
    data() {
        return {
            searchQuery: '',
            searchFilter: 'book',
            searchColumn: '',
            columnOptions: [],
            searchResults: [],
            isModalVisible: false
        };
    },
    methods: {
        updateColumnOptions() {
            if (this.searchFilter === 'book') {
                this.columnOptions = ['name', 'description', 'author', 'section_name'];
            } else if (this.searchFilter === 'section') {
                this.columnOptions = ['name', 'description'];
            }
            this.searchColumn = this.columnOptions[0] || '';
        },
        async performSearch() {
            if (this.searchQuery.trim() === '' || this.searchColumn === '') {
                console.log('Search query or column is empty');
                return;
            }

            try {
                const endpoint = this.searchFilter === 'book' ? '/api/search/book' : '/api/search/section';
                console.log(`Sending request to ${endpoint} with query: ${this.searchQuery} and column: ${this.searchColumn}`);
                
                const response = await axiosFetch.get(endpoint, {
                    params: {
                        query: this.searchQuery,
                        column: this.searchColumn
                    }
                });
                console.log('Search response:', response.data);

                // Update search results and show the modal
                this.searchResults = response.data;
                this.isModalVisible = true;
            } catch (error) {
                console.error('Search error:', error);
            }
        },
        handleLogout() {
            localStorage.clear();
            sessionStorage.clear();
            this.$router.push('/');
        }
    },
    mounted() {
        this.updateColumnOptions();
    }
}

</script>

<style>
#header {
    height: 60px; 
    position: sticky;
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    background-color: bisque;
}
.header-first {
    display: flex; 
    align-items: center;
}
.header-center {
}
.header-center form {
    border: 1px solid black;
    border-radius: 20px;
    padding: 0 10px;
}
.header-center input {
    padding: 10px; 
    border: none;
    background-color: bisque;
}
.header-center input:focus {
    outline: none;
}
.header-center button {
    padding: 3px; 
    background: none; 
    border: none;
    cursor: pointer;
}
.header-center button:hover {
    border: 1px solid red; 
    border-radius: 20px;
}
.header-end {
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    gap: 10px;
    padding: 10px;
}
.user-logo {
    width: 50px; 
    height: 50px; 
    border-radius: 100px; 
    object-fit: cover;
    cursor: pointer;
}

/* Modal Styles */
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}
.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 600px;
    width: 100%;
}
.close {
    float: right;
    font-size: 24px;
    cursor: pointer;
}
</style>
