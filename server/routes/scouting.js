const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const ScoutingEntry = require('../models/ScoutingEntry');
const Season = require('../models/Season');
const { check, validationResult } = require('express-validator');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');
const multer = require('multer');

// Configure file upload middleware
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   POST api/scouting
// @desc    Create a new scouting entry
// @access  Private
router.post('/', auth, [
  check('teamNumber', 'Team number is required').not().isEmpty(),
  check('matchNumber', 'Match number is required').not().isEmpty(),
  check('alliance', 'Alliance is required').isIn(['red', 'blue']),
  check('seasonId', 'Season ID is required').not().isEmpty()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Create new scouting entry
    const entry = await ScoutingEntry.create(req.body);
    res.json(entry);
  } catch (err) {
    console.error('Create scouting entry error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/scouting/bulk
// @desc    Create multiple scouting entries (for sync)
// @access  Private
router.post('/bulk', auth, async (req, res) => {
  try {
    if (!req.body.entries || !Array.isArray(req.body.entries)) {
      return res.status(400).json({ message: 'Entries array is required' });
    }

    const entries = await ScoutingEntry.bulkCreate(req.body.entries);
    res.json({ message: `${entries.length} entries saved`, entries });
  } catch (err) {
    console.error('Bulk create scouting entries error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/scouting
// @desc    Get scouting entries by season and optional team
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { seasonId, teamNumber } = req.query;
    
    if (!seasonId) {
      return res.status(400).json({ message: 'Season ID is required' });
    }

    let entries;
    if (teamNumber) {
      entries = await ScoutingEntry.findByTeam(seasonId, teamNumber);
    } else {
      entries = await ScoutingEntry.findBySeasonId(seasonId);
    }

    res.json(entries);
  } catch (err) {
    console.error('Get scouting entries error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/scouting/:seasonId
// @desc    Delete all scouting entries for a season
// @access  Admin
router.delete('/:seasonId', adminAuth, async (req, res) => {
  try {
    await ScoutingEntry.deleteBySeasonId(req.params.seasonId);
    res.json({ message: 'All scouting entries for the season have been deleted' });
  } catch (err) {
    console.error('Delete scouting entries error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/scouting/stats
// @desc    Get scouting data statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await ScoutingEntry.getStats();
    res.json(stats);
  } catch (err) {
    console.error('Get scouting stats error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/scouting/export/:seasonId
// @desc    Export scouting data for a season
// @access  Private
router.get('/export/:seasonId', auth, async (req, res) => {
  try {
    const { seasonId } = req.params;
    const format = req.query.format || 'csv';
    
    // Get all entries for the season
    const entries = await ScoutingEntry.findBySeasonId(seasonId);
    
    if (!entries || entries.length === 0) {
      return res.status(404).json({ message: 'No scouting data found for this season' });
    }
    
    // Get season info for context
    const season = await Season.findById(seasonId);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    
    if (format === 'json') {
      // Return JSON data
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=scouting-data-${season.name}.json`);
      return res.json(entries);
    } else if (format === 'csv') {
      // Convert to CSV
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=scouting-data-${season.name}.csv`);
      
      // Get all possible fields from entries
      const fields = new Set(['teamNumber', 'matchNumber', 'alliance', 'scoutName', 'timestamp']);
      entries.forEach(entry => {
        Object.keys(entry).forEach(key => {
          if (!['id', 'seasonId', 'synced'].includes(key)) {
            fields.add(key);
          }
        });
      });
      
      // Create CSV header
      const headerRow = Array.from(fields).join(',') + '\n';
      res.write(headerRow);
      
      // Write each entry as a CSV row
      entries.forEach(entry => {
        const row = Array.from(fields).map(field => {
          const value = entry[field] || '';
          // Handle values that might contain commas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',') + '\n';
        
        res.write(row);
      });
      
      return res.end();
    } else {
      return res.status(400).json({ message: 'Invalid export format. Use "csv" or "json".' });
    }
  } catch (err) {
    console.error('Export scouting data error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/scouting/import
// @desc    Import scouting data
// @access  Admin
router.post('/import', [adminAuth, upload.single('file')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { seasonId, format = 'csv' } = req.body;
    
    if (!seasonId) {
      return res.status(400).json({ message: 'Season ID is required' });
    }
    
    // Verify that the season exists
    const season = await Season.findById(seasonId);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    
    const entries = [];
    let skipped = 0;
    
    if (format === 'json') {
      try {
        const jsonData = JSON.parse(req.file.buffer.toString());
        
        if (!Array.isArray(jsonData)) {
          return res.status(400).json({ message: 'JSON data must be an array of scouting entries' });
        }
        
        // Process each entry
        for (const entry of jsonData) {
          if (!entry.teamNumber || !entry.matchNumber) {
            skipped++;
            continue;
          }
          
          entries.push({
            ...entry,
            seasonId, // Ensure correct season ID
            synced: true
          });
        }
      } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON format' });
      }
    } else if (format === 'csv') {
      // Create a temporary file to process the CSV
      const tempFilePath = path.join(__dirname, 'temp-import.csv');
      fs.writeFileSync(tempFilePath, req.file.buffer);
      
      // Process CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(tempFilePath)
          .pipe(csv())
          .on('data', (data) => {
            if (!data.teamNumber || !data.matchNumber) {
              skipped++;
              return;
            }
            
            entries.push({
              ...data,
              seasonId,
              synced: true
            });
          })
          .on('end', () => {
            resolve();
          })
          .on('error', (err) => {
            reject(err);
          });
      });
      
      // Remove the temporary file
      fs.unlinkSync(tempFilePath);
    } else {
      return res.status(400).json({ message: 'Invalid format. Use "csv" or "json".' });
    }
    
    // Save all entries
    if (entries.length > 0) {
      await ScoutingEntry.bulkCreate(entries);
    }
    
    res.json({
      message: `Import complete. ${entries.length} entries imported, ${skipped} skipped.`,
      imported: entries.length,
      skipped
    });
  } catch (err) {
    console.error('Import scouting data error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;