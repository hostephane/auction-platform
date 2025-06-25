const express = require('express');
const cors = require('cors');    // <-- importer cors

const userRoutes = require('./userService');
const auctionRoutes = require('./auctionService');
const bidRoutes = require('./bidService');

const app = express();

app.use(cors());  // <-- autoriser toutes les origines (pour dev uniquement)
app.use(express.json());

// routes
app.use(userRoutes);
app.use(auctionRoutes);
app.use(bidRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
