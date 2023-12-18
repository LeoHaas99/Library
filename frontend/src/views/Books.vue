<template>
    <img class="logo" src="../../logo_white.svg" alt="Logo" />
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
        <GridItem
          v-for="book in booksOfYear"
          :key="book.BuchId"
          :book="book"
          :imageUrl="API.IMAGE_URL"
        />
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, computed, watch } from 'vue';
import API from '../services/api';
import GridItem from '../components/GridItem.vue'

const displayedBooks = ref([]);

getBooks();

async function getBooks() {
    try {
        const { data } = await API.get('book');
        displayedBooks.value = data.map(book => ({ ...book, imageLoaded: false }));
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
  
<style scoped>
.grid-container {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    margin-bottom: 2rem;
}

.year-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 3rem;
    grid-auto-flow: dense;
}

.logo {
    height: 50px;
    display: block;
    margin: 2rem auto 1rem auto;
}

#title {
    text-align: center;
    font-size: 4rem;
    margin-bottom: 4rem;
    margin-top: 0;
}

.controls {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}

button {
    background-color: var(--color-primary);
    border: none;
    color: white;
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover:not(:disabled) {
    background-color: var(--color-primary-dark);
}

button:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
}

select {
    font-size: 1.2rem;
    padding: 1rem 2rem;
    margin: 0 1rem;
    border-radius: 4px;
    border: 2px solid var(--color-secondary);
    appearance: none;
    background-color: #ffffff;
    transition: border-color 0.3s;
}

select:focus {
    border-color: var(--color-secondary-dark);
    outline: none;
}

@media screen and (max-width: 1200px) {
  .year-grid {
    grid-template-columns: repeat(auto-fill, minmax(45%, 1fr));
    gap: 2rem;
  }
}

@media screen and (max-width: 767px) {
  #title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
  .year-grid {
    gap: 1.5rem;
  }
}

@media screen and (max-width: 550px) {
  .year-grid {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    gap: 1rem;
  }
}

</style>
