const Quote = require("../models/Quote");
const User = require("../models/User");

const getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.render("quotes", { quotes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching quotes" });
  }
};

const getRandomQuote = async (req, res) => {
  try {
    const count = await Quote.countDocuments();
    const random = Math.floor(Math.random() * count);
    const quote = await Quote.findOne().skip(random);
    res.render("randomquotes", { quote });
  } catch (error) {
    res.status(500).json({ error: "Error fetching random quote" });
  }
};


const searchQuotes = async (req, res) => {
  try {
    const { query } = req.query;
    const quotes = await Quote.find({
      $or: [
        { text: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });
    res.render('search',{quotes})
  } catch (error) {
    res.status(500).json({ error: "Error searching quotes" });
  }
};

const addQuote = async (req, res) => {
  try {
    const { text, author, tags } = req.body;
    const newQuote = new Quote({ text, author, tags });
    await newQuote.save();
    res.status(201).json(newQuote);
  } catch (error) {
    res.status(500).json({ error: "Error adding quote" });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    await Quote.findByIdAndDelete(id);
    res.status(200).json({ message: "Quote deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting quote" });
  }
};

const getAdminQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quotes for admin" });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users for admin" });
  }
};

module.exports = {
  getAllQuotes,
  getRandomQuote,
  searchQuotes,
  addQuote,
  deleteQuote,
  getAdminQuotes,
  getAdminUsers,
};
