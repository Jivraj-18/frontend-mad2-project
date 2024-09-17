<template>
    <div class="section-container">
        <h1>
            {{ section.name }}
        </h1>
        <p>Description: {{ section.description }}</p>
        <!-- <button @click="confirmDeleteSection(section)" class="upload-button">Delete Section</button>
        <div class="upload-book">
            <button @click="showEditPopup" class="upload-button">Edit Section</button>
            <div class="upload-overlay" v-if="isEditPopupVisible">
                <div class="upload-book-form">
                    <span class="close" @click="hideEditPopup">&times;</span>
                    <form @submit.prevent="editSection(section)" class="upload-book-form">
                        <span class="close" @click="hideEditPopup">&times;</span>
                        <h2>Edit Section</h2>
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
                    <button @click="hideEditPopup" class="close-button">Close</button>
                </div>
            </div>
        </div> -->
    </div>

    <div class="add-book">
        <button @click="showAddBookPopup" class="upload-button">Add Book</button>
        <div class="upload-overlay" v-if="isAddBookPopupVisible">
            <div class="upload-book-form">
                <span class="close" @click="hideAddBookPopup">&times;</span>
                <form @submit.prevent="addBookToSection(section)" class="upload-book-form">
                    <span class="close" @click="hideAddBookPopup">&times;</span>
                    <h2>Add Book</h2>
                    <label for="book-id">Book ID</label>
                    <input type="text" id="book-id" class="text-input" v-model="newBookId" />
                    <br>
                    <button type="submit" class="submit-button">Submit</button>
                </form>
                <button @click="hideAddBookPopup" class="close-button">Close</button>
            </div>
        </div>
    </div>

    <div class="books-list">
        <table>
            <thead>
                <tr>
                    <th>Book Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="book in books" :key="book.id" style="background-color: white;">
                    <td>{{ book.name }}</td>
                    <td>{{ book.description }}</td>
                    <td>
                        <button @click="viewBook(book)" class="view-button">View</button>
                        <button @click="confirmDeleteBook(section,book)" class="delete-button">Remove</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axiosFetch from "../../axios"
export default {
    mounted() {
        axiosFetch.get(`/api/librarian/section/${this.$route.params.id}`).then(resp => {
            this.section = resp.data
            console.log(resp.data)
        })
        axiosFetch.get(`/api/user/section/${this.$route.params.id}/books`).then(resp => {
            console.log(resp.data)
            this.books = resp.data
        })
    },
    data() {
        return {
            section: {
                id: '',
                name: '',
                description: '',
                file: null
            },
            books: [],
            isEditPopupVisible: false,
            isAddBookPopupVisible: false,
            newBookId: ''
        }
    },
    methods: {
        // editSection(section) {
        //     console.log(section);
        //     const uploadData = new FormData()
        //     uploadData.append("name", section.name)
        //     uploadData.append("description", section.description)
        //     uploadData.append("section_image", section.file)
        //     console.log(section.file);
        //     axiosFetch.put(`/api/librarian/section/${section.id}`, uploadData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     })
        // },
        // showEditPopup() {
        //     this.isEditPopupVisible = true;
        // },
        hideEditPopup() {
            this.isEditPopupVisible = false;
        },
        showAddBookPopup() {
            this.isAddBookPopupVisible = true;
        },
        hideAddBookPopup() {
            this.isAddBookPopupVisible = false;
        },
        bookdetails(book) {
            this.$router.push(`/librarian/book/${book.id}`)
            console.log(book)
        },
        handleFileChange(event) {
            console.log(event.target.files[0]);
            this.section.file = event.target.files[0];
        },
        // confirmDeleteSection(section) {
        //     if (confirm(`Are you sure you want to delete the section "${section.name}"?`)) {
        //         this.deleteSection(section);
        //     }
        // },
        // deleteSection(section) {
        //     axiosFetch.delete(`/api/librarian/section/${section.id}`)
        //     this.$router.push(`/librarian/section`)
        // },
        addBookToSection(section) {
            axiosFetch.post(`/api/librarian/section/${section.id}/book/${this.newBookId}`, { book_id: this.newBookId }).then(resp => {
                this.books.push(resp.data);
                this.hideAddBookPopup();
                this.newBookId = '';
            }).catch(err => {
                console.error(err);
            });
        },
        viewBook(book) {
            this.$router.push(`/librarian/book/${book.id}`);
        },
        confirmDeleteBook(section,book) {
            if (confirm(`Are you sure you want to delete the book "${book.name}"?`)) {
                this.deleteBook(section,book);
            }
        },
        deleteBook(section,book) {
            axiosFetch.delete(`/api/librarian/section/${section.id}/book/${book.id}`).then(resp => {
                console.log(resp.data);
                this.books = this.books.filter(b => b.id !== book.id);
            }).catch(err => {
                console.error(err);
            });
        }
    }
}
</script>

<style scoped>
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

.book-item {
    width: 1200px;
    /* Set width */
    height: 100px;
    /* Set height */
    background-color: #f0f0f0;
    /* Background color */
    border: 1px solid #ccc;
    /* Border */
    border-radius: 5px;
    /* Border radius for rounded corners */
    padding: 20px;
    /* Padding inside the box */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* Box shadow for a subtle effect */
    display: flex;
    gap: 30px
}

/* CSS for content inside the rectangular box */
.book-item h2 {
    margin-top: 0;
    /* Remove default margin for heading */
}

.book-item p {
    margin-bottom: 0;
    /* Remove default margin for paragraph */
}

.book-item:hover {
    background-color: white;
    /* Change this to the color you want when hovering */
}

.section-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

button {
    padding: 10px 20px;
    margin: 5px;
    background-color: #008CBA;
    color: white;
    border: none;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 8px;
}

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
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
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
