<template>
    <img id="logo" src="../../public/logo.svg" alt="Logo" />
    <h1 id="title">Library</h1>
    <div class="controls">
        <button :disabled="!prevYear" @click="changeYear(-1)">&larr;</button>
        <select v-model="selectedYear">
            <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
        </select>
        <button :disabled="!nextYear" @click="changeYear(1)">&rarr;</button>
    </div>
    <div class="grid-container">
        <div v-for="(booksOfYear, year) in filteredBooksByYear" :key="year">
            <div class="year-grid">
                <div class="grid-item" v-for="book in booksOfYear" :key="book.BuchId"
                    :style="{ backgroundImage: `url(${API.IMAGE_URL}${book.BildUrl})` }"
                    :class="{ 'double-size': book.Favorit === 1 }">
                    <div class="book-info">
                        <h3 class="bookTitle">{{ book.Buchtitel }}</h3>
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
import { ref, computed, watch } from 'vue';
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

const uniqueYears = computed(() => {
    return Array.from(new Set(displayedBooks.value.map((book) => book.Jahr))).sort(
        (a, b) => b - a
    );
});

const selectedYear = ref(null);

watch(uniqueYears, (newVal) => {
    if (newVal.length) {
        selectedYear.value = newVal[0];
    }
});

const filteredBooksByYear = computed(() => {
    if (selectedYear.value) {
        return { [selectedYear.value]: booksByYear.value[selectedYear.value] };
    } else {
        return booksByYear.value;
    }
});

const prevYear = computed(() => uniqueYears.value.includes(selectedYear.value - 1));
const nextYear = computed(() => uniqueYears.value.includes(selectedYear.value + 1));

function changeYear(offset) {
    if (offset === -1 && prevYear.value) {
        selectedYear.value -= 1;
    } else if (offset === 1 && nextYear.value) {
        selectedYear.value += 1;
    }
}
</script>
  
  
<style>
.grid-container {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
}

.year-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 3rem;
    margin-bottom: 2rem;
    grid-auto-flow: dense;
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
    position: relative;
}

.double-size {
    grid-column-end: span 2;
    grid-row-end: span 2;
}

.book-info {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    padding: 0.5rem;
    border-radius: 0.5rem;
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    color: white;
}

.grid-item:hover .book-info {
    opacity: 1;
}

.year-dropdown {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
}

.year-dropdown label {
    margin-right: 1rem;
}

.year-dropdown select {
    padding: 0.5rem;
    font-size: 1rem;
}

#logo {
    height: 100px;
    display: block;
    margin: 0 auto;
}

#title {
    text-align: center;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

button {
  background-color: #6200ee;
  border: none;
  color: white;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #3700b3;
}

button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

select {
  font-size: 1rem;
  padding: 0.5rem;
  margin: 0 1rem;
  border-radius: 4px;
  border: 1px solid #bdbdbd;
  appearance: none;
  background-color: #ffffff;
  transition: border-color 0.3s;
}

select:focus {
  border-color: #6200ee;
  outline: none;
}

.bookTitle{
    text-align: center;
}
</style>
  