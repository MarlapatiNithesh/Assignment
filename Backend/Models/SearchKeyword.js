const mongoose = require('mongoose');

const SearchKeywordSchema = new mongoose.Schema({
  term: { type: String, unique: true },  // each term is unique in the collection
  count: { type: Number, default: 1 }    // default count is 1
});

const SearchKeyword = mongoose.model('SearchKeyword', SearchKeywordSchema);

module.exports = SearchKeyword;
