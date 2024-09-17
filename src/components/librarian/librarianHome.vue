<template>
  <div class="librarian-dashboard">
    <h1>Library Statistics Dashboard</h1>
    <div class="top-buttons">
      <button @click="generateCSV">Generate CSV</button>
      <button @click="downloadCSV">Download CSV</button>
    </div>
    <div v-if="dataLoaded" class="chart-container">
      <div class="chart">
        <h2>User Registration Over Time</h2>
        <LineChart :data="userRegistrationData" :options="chartOptions" />
      </div>
      <div class="chart">
        <h2>Most Popular Books</h2>
        <BarChart :data="popularBooksData" :options="chartOptions" />
      </div>
      <div class="chart">
        <h2>Books by Genre</h2>
        <PieChart :data="booksByGenreData" :options="chartOptions" />
      </div>
      <div class="chart">
        <h2>Book Issue Status</h2>
        <BarChart :data="userActivityData" :options="chartOptions" />
      </div>
    </div>
    <div v-else>Loading charts...</div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { Line, Bar, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, BarElement, ArcElement } from 'chart.js';
import axiosFetch from '../../axios';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, BarElement, ArcElement);

export default {
  name: 'LibrarianDashboard',
  components: {
    LineChart: Line,
    BarChart: Bar,
    PieChart: Pie,
  },
  setup() {
    const chartData = ref({
      userRegistration: {
        labels: [],
        datasets: []
      },
      popularBooks: {
        labels: [],
        datasets: []
      },
      booksByGenre: {
        labels: [],
        datasets: []
      },
      userActivity: {
        labels: [],
        datasets: []
      }
    });

    const dataLoaded = computed(() =>
      chartData.value.userRegistration.labels.length &&
      chartData.value.popularBooks.labels.length &&
      chartData.value.booksByGenre.labels.length &&
      chartData.value.userActivity.labels.length
    );

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };

    const loadChartData = async () => {
      try {
        const userRegistrationData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'New Users',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        };

        // Fetch popular books and filter by high ratings
        const popularBooksResponse = await axiosFetch.get('/api/librarian/book');
        const sortedBooks = popularBooksResponse.data
          .filter(book => book.rating >= 4)  // Filter high rating books
          .sort((a, b) => b.rating - a.rating); // Sort by rating in descending order

        const popularBooksData = {
          labels: sortedBooks.map(book => book.name),
          datasets: [{
            label: 'Rating',
            data: sortedBooks.map(book => book.rating),
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
          }]
        };

        // Fetch books by genre
        const booksByGenreResponse = await axiosFetch.get('/api/librarian/section');
        const booksByGenreData = {
          labels: booksByGenreResponse.data.map(section => section.name),
          datasets: [{
            data: booksByGenreResponse.data.map(section => section.books_count),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Customize as needed
          }]
        };

        // Fetch user activity
        const userActivityResponse = await axiosFetch.get('/api/librarian/book/issue');
        const userActivityData = {
          labels: ['Pending', 'Accepted', 'Rejected', 'Returned', 'Revoked'],
          datasets: [{
            label: 'Status Count',
            data: [
              userActivityResponse.data.filter(issue => issue.status === 0).length,
              userActivityResponse.data.filter(issue => issue.status === 1).length,
              userActivityResponse.data.filter(issue => issue.status === 2).length,
              userActivityResponse.data.filter(issue => issue.status === 3).length,
              userActivityResponse.data.filter(issue => issue.status === 4).length,
            ],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(153, 102, 255, 0.6)'],
          }]
        };

        chartData.value = {
          userRegistration: userRegistrationData,
          popularBooks: popularBooksData,
          booksByGenre: booksByGenreData,
          userActivity: userActivityData
        };
      } catch (error) {
        console.error('Error loading chart data:', error);
      }
    };

    const generateCSV = async () => {
      try {
        await axiosFetch.get('/generate_csv');
        alert('CSV generation requested');
      } catch (error) {
        console.error('Error generating CSV:', error);
      }
    };

    const downloadCSV = async () => {
      try {
        const response = await axiosFetch.get('/download_csv', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.csv'); // File name for download
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error downloading CSV:', error);
      }
    };

    onMounted(loadChartData);

    return {
      dataLoaded,
      chartOptions,
      userRegistrationData: computed(() => chartData.value.userRegistration),
      popularBooksData: computed(() => chartData.value.popularBooks),
      booksByGenreData: computed(() => chartData.value.booksByGenre),
      userActivityData: computed(() => chartData.value.userActivity),
      generateCSV,
      downloadCSV
    };
  }
};
</script>

<style scoped>
.librarian-dashboard {
  padding: 20px;
  position: relative;
}

.top-buttons {
  position: absolute;
  top: 20px;
  right: 20px;
}

.top-buttons button {
  margin-left: 10px;
}

.chart-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.chart {
  width: 45%;
  height: 300px;
  margin-bottom: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  text-align: center;
  font-size: 1.2em;
}
</style>
