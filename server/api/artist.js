// src/routes/artist.js

const express = require('express');
const { Artists } = require('../models');
const router = express.Router();

// Lấy tất cả artists
router.get('/artists', async (req, res) => {
  try {
    const artists = await Artists.findAll();
    res.status(200).json(artists);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving artists", error: err });
  }
});

// Lấy artist theo ID
router.get('/artists/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const artist = await Artists.findByPk(id);
    if (artist) {
      res.status(200).json(artist);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (err) {
    res.status(500).json({ message: "Error retrieving artist", error: err });
  }
});

// Thêm mới artist
router.post('/artists', async (req, res) => {
  const { name, bio, country, profileCoverPath } = req.body;
  try {
    const newArtist = await Artists.create({
      name,
      bio,
      country,
      profileCoverPath
    });
    res.status(201).json(newArtist);
  } catch (err) {
    res.status(500).json({ message: "Error creating artist", error: err });
  }
});

// Cập nhật thông tin artist
router.put('/artists/:id', async (req, res) => {
  const { id } = req.params;
  const { name, bio, country, profileCoverPath } = req.body;
  try {
    const artist = await Artists.findByPk(id);
    if (artist) {
      await artist.update({
        name,
        bio,
        country,
        profileCoverPath
      });
      res.status(200).json(artist);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating artist", error: err });
  }
});

// Xóa artist
router.delete('/artists/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const artist = await Artists.findByPk(id);
    if (artist) {
      await artist.destroy();
      res.status(200).json({ message: 'Artist deleted successfully' });
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting artist", error: err });
  }
});

module.exports = router;
