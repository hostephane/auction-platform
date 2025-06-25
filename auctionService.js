const express = require('express');
const authenticate = require('./authMiddleware');

const router = express.Router();
const auctions = [];

router.post('/auctions', authenticate, (req, res) => {
  const { title, description, starting_price, ends_at } = req.body;
  if (!title || !starting_price || !ends_at) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newAuction = {
    id: auctions.length + 1,
    title,
    description: description || '',
    starting_price,
    current_price: starting_price,
    status: 'pending',
    ends_at,
    owner_id: req.userId
  };

  auctions.push(newAuction);
  res.status(201).json(newAuction);
});

router.get('/auctions', (req, res) => {
  res.json(auctions);
});

router.get('/auctions/:id', (req, res) => {
  const auction = auctions.find(a => a.id == req.params.id);
  if (!auction) return res.status(404).json({ message: 'Auction not found' });
  res.json(auction);
});

router.delete('/auctions/:id', authenticate, (req, res) => {
  const index = auctions.findIndex(a => a.id == req.params.id && a.owner_id === req.userId);
  if (index === -1) return res.status(403).json({ message: 'Not allowed to delete' });

  if (auctions[index].status === 'ended') return res.status(400).json({ message: 'Auction already ended' });

  auctions.splice(index, 1);
  res.json({ message: 'Auction deleted' });
});

module.exports = router;
