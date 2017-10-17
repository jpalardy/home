/* global Vue, fetch */

const app = new Vue({
  el: '#app',
  template: '#template',
  data: {
    books: [],
    years: [],
    selectedYears: [],
  },
  //-------------------------------------------------
  computed: {
    filteredBooks() {
      return this.books.filter(book => this.selectedYears.includes(book.year));
    },
  },
  //-------------------------------------------------
  watch: {
    selectedYears() {
      console.log(JSON.stringify(this.selectedYears));
    },
  },
  //-------------------------------------------------
  created() {
    fetch('data/books.json').then(response => response.json()).then((books) => {
      this.books = books;
      this.years = [...new Set(books.map(book => book.year))].sort();
      this.selectedYears = this.years;
    });
  },
});

