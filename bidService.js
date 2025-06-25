const express = require('express');
const authenticate = require('./authMiddleware');
const auctionService = require('./auctionService');

const router = express.Router();
const bids = [];

// Hack : accès au tableau auctions défini dans auctionService
const auctions = (() => {
  try {
    return require.cache[require.resolve('./auctionService')].exports.__auctions || [];
  } catch {
    return [];
  }
})();

router.post('/bids', authenticate, (req, res) => {
  const { auction_id, amount } = req.body;
  if (!auction_id || !amount) return res.status(400).json({ message: 'Missing fields' });

  const auction = auctions.find(a => a.id == auction_id);
  if (!auction) return res.status(404).json({ message: 'Auction not found' });

  if (auction.status !== 'live') return res.status(400).json({ message: 'Auction not live' });
  if (amount <= auction.current_price) return res.status(400).json({ message: 'Bid too low' });

  auction.current_price = amount;

  const newBid = {
    id: bids.length + 1,
    user_id: req.userId,
    auction_id,
    amount,
    timestamp: new Date()
  };

  bids.push(newBid);
  res.status(201).json(newBid);
});

router.get('/bids/auction/:auction_id', (req, res) => {
  const result = bids.filter(b => b.auction_id == req.params.auction_id);
  res.json(result);
});

router.get('/bids/user/:user_id', (req, res) => {
  const result = bids.filter(b => b.user_id == req.params.user_id);
  res.json(result);
});

module.exports = router;
