<template>
    <div class="grid-container">
      <div v-for="(booksOfYear, year) in booksByYear" :key="year">
        <h2>{{ year }}</h2>
        <div class="year-grid">
          <div
            class="grid-item"
            v-for="book in booksOfYear"
            :key="book.BuchId"
            :style="{ backgroundImage: `url(${API.IMAGE_URL}${book.BildUrl})` }"
          >
            <div class="book-info">
              <h3>{{ book.Buchtitel }}</h3>
              <p>{{ book.Autor }}</p>
              <p>{{ book.Seitenzahl }} Seiten</p>
              <p>{{ book.Jahr }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import API from '../services/api';
  
  const displayedBooks = ref([]);
  getBooks();
  
  async function getBooks() {
    try {
      const { data } = await API.get('book');
      displayedBooks.value = data;
    } catch (err) {
      console.log(err);
    }
  }
  
  const booksByYear = computed(() => {
    return displayedBooks.value.reduce((result, book) => {
      const year = book.Jahr;
      if (!result[year]) {
        result[year] = [];
      }
      result[year].push(book);
      return result;
    }, {});
  });
  </script>
  
  <style>
  .grid-container {
    padding: 1rem;
  }
  
  .year-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .grid-item {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 300px;
  }
  
  .book-info {
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem;
  border-radius: 0.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.grid-item:hover .book-info {
  opacity: 1;
}
  </style>
  