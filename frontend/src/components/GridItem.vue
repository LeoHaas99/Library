<template>
    <div class="grid-item" :class="{ 'double-size': book.Favorit === 1 }">
      <img
        :src="`${imageUrl}${book.BildUrl}`"
        :alt="`${book.Buchtitel}`"
        :class="{ 'image-loaded': book.imageLoaded }"
        @load="book.imageLoaded = true"
      />
      <div class="book-info">
        <h3 class="bookTitle">{{ book.Buchtitel }}</h3>
        <p>{{ book.Autor }}</p>
        <p>{{ book.Seitenzahl }} Seiten</p>
        <p>{{ book.Jahr }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    book: {
      type: Object,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  });
  </script>
  
  <style scoped>
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
    background-color: var(--color-gray);
    overflow: hidden;
  }
  
  .grid-item img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .grid-item .image-loaded {
    opacity: 1;
  }
  
  .grid-item .book-info {
    z-index: 1;
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
  
  .bookTitle {
    text-align: center;
  }
  </style>
  