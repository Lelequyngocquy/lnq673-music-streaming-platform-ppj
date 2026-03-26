const express = require('express');
const router = express.Router();
const { Albums, Artists, Labels } = require('../models');

// Create a new album
router.post('/albums', async (req, res) => {
  try {
    const { AlbumID, title, version, artistID, labelID, releaseDay, genre, year, duration, coverPath, audioPath, views } = req.body;

    // Check if artist and label exist
    const artist = await Artists.findByPk(artistID);
    const label = await Labels.findByPk(labelID);

    console.log("Artist found:", artist);  // Debugging log
    console.log("Label found:", label);    // Debugging log

    if (!artist || !label) {
      return res.status(400).json({ message: 'Artist or Label not found' });
    }

    // Create the new album
    const album = await Albums.create({
      AlbumID,
      title,
      version,
      artistID,
      labelID,
      releaseDay,
      genre,
      year,
      duration,
      coverPath,
      audioPath,
      views,
    });

    res.status(201).json({ message: 'Album created successfully', album });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating album', error: error.message });
  }
});

// Get all albums with Artist details
router.get('/albums', async (req, res) => {
  try {
    const albums = await Albums.findAll({
      include: [
        {
          model: Artists,
          as: 'Artist',  // Trùng với alias trong quan hệ `belongsTo`
          attributes: ['id', 'name'],  // Các thuộc tính cần lấy từ Artists
        },
        {
          model: Labels,
          as: 'Label',  // Thêm Label vào nếu cần
          attributes: ['id', 'name'],  // Các thuộc tính cần lấy từ Labels
        },
      ],
    });

    res.status(200).json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching albums', error: error.message });
  }
});

// Get album by AlbumID or Title (not both)
router.get('/albums/search', async (req, res) => {
  try {
    const { AlbumID, title } = req.query;

    // Check if both albumID and title are provided
    if (AlbumID && title) {
      return res.status(400).json({ message: 'Please provide either AlbumID or Title, not both' });
    }

    let whereConditions = {};
    if (AlbumID) {
      whereConditions.AlbumID = AlbumID;  // Correctly reference albumID
    }
    if (title) {
      whereConditions.title = title;  // Correctly reference title
    }

    // Find the album(s) based on the conditions
    const albums = await Albums.findAll({
      where: whereConditions,
      include: [
        {
          model: Artists,
          as: 'Artist', // Ensure alias matches
          attributes: ['id', 'name'], // Include Artist data
        },
      ],
    });

    if (albums.length === 0) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.status(200).json(albums);  // Return the albums
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching album', error: error.message });
  }
});

// Update an album by AlbumID
router.put('/albums/:AlbumID', async (req, res) => {
  try {
    const { AlbumID } = req.params;
    const { title, version, artistID, labelID, releaseDay, genre, year, duration, coverPath, audioPath, views } = req.body;

    // Find the album by AlbumID
    const album = await Albums.findOne({
      where: { AlbumID: AlbumID },
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Update album with new data
    await album.update({
      title,
      version,
      artistID,
      labelID,
      releaseDay,
      genre,
      year,
      duration,
      coverPath,
      audioPath,
      views,
    });

    res.status(200).json({ message: 'Album updated successfully', album });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating album', error: error.message });
  }
});

// Increment views for an album
router.put('/albums/:AlbumID/increment-views', async (req, res) => {
  try {
    const { AlbumID } = req.params;

    // Find the album by AlbumID
    const album = await Albums.findOne({
      where: { AlbumID: AlbumID },
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Increment the views by 1
    album.views += 1;

    // Save the updated album
    await album.save();

    res.status(200).json({ message: 'Views updated successfully', album });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating views', error: error.message });
  }
});

// Delete an album by AlbumID
router.delete('/albums/:albumID', async (req, res) => {
  try {
    const { albumID } = req.params;

    // Find the album by AlbumID
    const album = await Albums.findOne({
      where: { AlbumID: albumID },
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Delete the album
    await album.destroy();

    res.status(200).json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting album', error: error.message });
  }
});

module.exports = router;
