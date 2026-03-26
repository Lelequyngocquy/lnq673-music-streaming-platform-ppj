const express = require('express');
const router = express.Router();
const { UserFavAlbums, UserRecents } = require('../models');

// Get favorite album by userId and AlbumID
router.get('/favorites', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId and AlbumID are required' });
    }

    const favorite = await UserFavAlbums.findAll({ where: { userId } });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite album not found' });
    }

    res.status(200).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching favorite album', error: error.message });
  }
});

// Add a new favorite album
router.post('/favorites', async (req, res) => {
  try {
    const { userId, AlbumID } = req.body;

    if (!userId || !AlbumID) {
      return res.status(400).json({ message: 'userId and AlbumID are required' });
    }

    const favorite = await UserFavAlbums.create({ userId, AlbumID });
    res.status(201).json({ message: 'Favorite album added successfully', favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding favorite album', error: error.message });
  }
});

// Update or create a favorite album
router.put('/favorites', async (req, res) => {
  try {
    const { userId, AlbumID } = req.body;

    if (!userId || !AlbumID) {
      return res.status(400).json({ message: 'userId and AlbumID are required' });
    }

    const [favorite, created] = await UserFavAlbums.findOrCreate({
      where: { userId, AlbumID },
      defaults: { userId, AlbumID },
    });

    if (!created) {
      return res.status(200).json({ message: 'Favorite album already exists', favorite });
    }

    res.status(201).json({ message: 'Favorite album added successfully', favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding favorite album', error: error.message });
  }
});

// Delete a favorite album
router.delete('/favorites', async (req, res) => {
  try {
    const { userId, AlbumID } = req.body;

    if (!userId || !AlbumID) {
      return res.status(400).json({ message: 'userId and AlbumID are required' });
    }

    const deleted = await UserFavAlbums.destroy({ where: { userId, AlbumID } });

    if (!deleted) {
      return res.status(404).json({ message: 'Favorite album not found' });
    }

    res.status(200).json({ message: 'Favorite album deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting favorite album', error: error.message });
  }
});

// Get recent album by userId and AlbumID
router.get('/recents', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId ) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const recent = await UserRecents.findAll({ where: { userId } });

    if (!recent) {
      return res.status(404).json({ message: 'Recent album not found' });
    }

    res.status(200).json(recent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recent album', error: error.message });
  }
});

// Add a new recent album with a 10-item limit and remove duplicates
router.post('/recents', async (req, res) => {
  try {
    const { userId, AlbumID } = req.body;

    if (!userId || !AlbumID) {
      return res.status(400).json({ message: 'userId and AlbumID are required' });
    }

    // Check if the album already exists in the user's recents
    const existingRecent = await UserRecents.findOne({ where: { userId, AlbumID } });

    if (existingRecent) {
      // Update the playedAt timestamp for the existing entry
      existingRecent.playedAt = new Date();
      await existingRecent.save();
    } else {
      // Add the new recent album
      await UserRecents.create({ userId, AlbumID, playedAt: new Date() });
    }

    // Fetch all recents for the user
    const userRecents = await UserRecents.findAll({
      where: { userId },
      order: [['playedAt', 'DESC']], // Order by playedAt, newest first
    });

    // Remove duplicates (keep only the latest for each AlbumID)
    const uniqueRecents = {};
    userRecents.forEach((recent) => {
      if (!uniqueRecents[recent.AlbumID]) {
        uniqueRecents[recent.AlbumID] = recent;
      }
    });

    const uniqueRecentIds = Object.values(uniqueRecents).map((recent) => recent.id);

    // Delete duplicate entries
    const duplicateIds = userRecents
      .filter((recent) => !uniqueRecentIds.includes(recent.id))
      .map((recent) => recent.id);

    if (duplicateIds.length > 0) {
      await UserRecents.destroy({ where: { id: duplicateIds } });
    }

    // If the user has more than 10 recent albums, delete the oldest ones
    const latestRecents = await UserRecents.findAll({
      where: { userId },
      order: [['playedAt', 'DESC']], // Order by playedAt, newest first
    });

    if (latestRecents.length > 10) {
      const excess = latestRecents.slice(10); // Get items beyond the 10th one
      const excessIds = excess.map((item) => item.id); // Extract their IDs

      await UserRecents.destroy({ where: { id: excessIds } });
    }

    res.status(201).json({
      message: 'Recent album added successfully, duplicates and old entries cleaned up',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding recent album', error: error.message });
  }
});

// Update or create a recent album
router.put('/recents', async (req, res) => {
  try {
    const { userId, AlbumID } = req.body;

    if (!userId || !AlbumID) {
      return res.status(400).json({ message: 'userId and AlbumID are required' });
    }

    const [recent, created] = await UserRecents.findOrCreate({
      where: { userId, AlbumID },
      defaults: { userId, AlbumID, playedAt: new Date() },
    });

    if (!created) {
      // Update the playedAt timestamp
      recent.playedAt = new Date();
      await recent.save();
      return res.status(200).json({ message: 'Recent album updated successfully', recent });
    }

    res.status(201).json({ message: 'Recent album added successfully', recent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding recent album', error: error.message });
  }
});

// Delete a recent album
router.delete('/recents', async (req, res) => {
  try {
    const { userId, AlbumID } = req.body;

    if (!userId || !AlbumID) {
      return res.status(400).json({ message: 'userId and AlbumID are required' });
    }

    const deleted = await UserRecents.destroy({ where: { userId, AlbumID } });

    if (!deleted) {
      return res.status(404).json({ message: 'Recent album not found' });
    }

    res.status(200).json({ message: 'Recent album deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting recent album', error: error.message });
  }
});

module.exports = router;
