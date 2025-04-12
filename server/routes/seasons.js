const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Season = require('../models/Season');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Configure file upload middleware
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   GET api/seasons
// @desc    Get all seasons
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const seasons = await Season.findAll();
    res.json(seasons);
  } catch (err) {
    console.error('Get seasons error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/seasons/current
// @desc    Get current season
// @access  Private
router.get('/current', auth, async (req, res) => {
  try {
    const season = await Season.findCurrent();
    
    if (!season) {
      return res.status(404).json({ message: 'No current season set' });
    }
    
    res.json(season);
  } catch (err) {
    console.error('Get current season error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/seasons/:id
// @desc    Get season by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const season = await Season.findById(req.params.id);
    
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    
    res.json(season);
  } catch (err) {
    console.error('Get season error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/seasons
// @desc    Create a new season
// @access  Admin
router.post('/', [
  adminAuth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('year', 'Year is required').isNumeric(),
    check('gameName', 'Game name is required').not().isEmpty(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('endDate', 'End date is required').not().isEmpty()
  ]
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const season = await Season.create(req.body);
    res.json(season);
  } catch (err) {
    console.error('Create season error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/seasons/:id
// @desc    Update a season
// @access  Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const season = await Season.updateById(req.params.id, req.body);
    res.json(season);
  } catch (err) {
    console.error('Update season error:', err.message);
    
    // Handle specific errors
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/seasons/:id
// @desc    Delete a season
// @access  Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Season.deleteById(req.params.id);
    res.json({ message: 'Season deleted' });
  } catch (err) {
    console.error('Delete season error:', err.message);
    
    // Handle specific errors
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/seasons/:id/config
// @desc    Get scouting config for a season
// @access  Private
router.get('/:id/config', auth, async (req, res) => {
  try {
    const config = await Season.getScoutingConfig(req.params.id);
    
    if (!config) {
      return res.status(404).json({ message: 'No scouting configuration found for this season' });
    }
    
    res.json(config);
  } catch (err) {
    console.error('Get scouting config error:', err.message);
    
    // Handle specific errors
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/seasons/:id/config
// @desc    Update scouting config for a season
// @access  Admin
router.put('/:id/config', adminAuth, async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'No config data provided' });
    }
    
    const season = await Season.updateScoutingConfig(req.params.id, req.body);
    res.json(season);
  } catch (err) {
    console.error('Update scouting config error:', err.message);
    
    // Handle specific errors
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/seasons/:id/teams
// @desc    Get teams for a season
// @access  Private
router.get('/:id/teams', auth, async (req, res) => {
  try {
    const season = await Season.findById(req.params.id);
    
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    
    res.json(season.teams || []);
  } catch (err) {
    console.error('Get teams error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/seasons/:id/teams/import
// @desc    Import teams for a season from CSV or JSON
// @access  Admin
router.post('/:id/teams/import', [adminAuth, upload.single('file')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { format = 'csv' } = req.body;
    
    // Verify that the season exists
    const season = await Season.findById(req.params.id);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    
    const teams = [];
    let skipped = 0;
    
    if (format === 'json') {
      try {
        const jsonData = JSON.parse(req.file.buffer.toString());
        
        if (!Array.isArray(jsonData)) {
          return res.status(400).json({ message: 'JSON data must be an array of teams' });
        }
        
        // Process each team
        for (const team of jsonData) {
          if (!team.number || !team.name) {
            skipped++;
            continue;
          }
          
          teams.push({
            number: team.number.toString(),
            name: team.name,
            location: team.location || '',
            website: team.website || '',
            rookieYear: team.rookieYear || null
          });
        }
      } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON format' });
      }
    } else if (format === 'csv') {
      // Create a temporary file to process the CSV
      const tempFilePath = path.join(__dirname, 'temp-teams-import.csv');
      fs.writeFileSync(tempFilePath, req.file.buffer);
      
      // Process CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(tempFilePath)
          .pipe(csv())
          .on('data', (data) => {
            if (!data.number || !data.name) {
              skipped++;
              return;
            }
            
            teams.push({
              number: data.number.toString(),
              name: data.name,
              location: data.location || '',
              website: data.website || '',
              rookieYear: data.rookieYear || null
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
    
    // Save teams to the season
    if (teams.length > 0) {
      await Season.addTeams(req.params.id, teams);
    }
    
    res.json({
      message: `Import complete. ${teams.length} teams imported, ${skipped} skipped.`,
      imported: teams.length,
      skipped
    });
  } catch (err) {
    console.error('Import teams error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/seasons/:id/matches
// @desc    Get matches for a season
// @access  Private
router.get('/:id/matches', auth, async (req, res) => {
  try {
    const season = await Season.findById(req.params.id);
    
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    
    res.json(season.matches || []);
  } catch (err) {
    console.error('Get matches error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/seasons/:id/matches/import
// @desc    Import matches for a season from CSV or JSON
// @access  Admin
router.post('/:id/matches/import', [adminAuth, upload.single('file')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { format = 'csv' } = req.body;
    
    // Verify that the season exists
    const season = await Season.findById(req.params.id);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    
    const matches = [];
    let skipped = 0;
    
    if (format === 'json') {
      try {
        const jsonData = JSON.parse(req.file.buffer.toString());
        
        if (!Array.isArray(jsonData)) {
          return res.status(400).json({ message: 'JSON data must be an array of matches' });
        }
        
        // Process each match
        for (const match of jsonData) {
          if (!match.number) {
            skipped++;
            continue;
          }
          
          matches.push({
            number: match.number.toString(),
            time: match.time || null,
            redAlliance: Array.isArray(match.redAlliance) ? match.redAlliance : [],
            blueAlliance: Array.isArray(match.blueAlliance) ? match.blueAlliance : [],
            redScore: match.redScore !== undefined ? match.redScore : null,
            blueScore: match.blueScore !== undefined ? match.blueScore : null
          });
        }
      } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON format' });
      }
    } else if (format === 'csv') {
      // Create a temporary file to process the CSV
      const tempFilePath = path.join(__dirname, 'temp-matches-import.csv');
      fs.writeFileSync(tempFilePath, req.file.buffer);
      
      // Process CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(tempFilePath)
          .pipe(csv())
          .on('data', (data) => {
            if (!data.number) {
              skipped++;
              return;
            }
            
            // Parse alliance teams from CSV
            const redAlliance = [];
            const blueAlliance = [];
            
            // Handle up to 3 teams per alliance
            for (let i = 1; i <= 3; i++) {
              if (data[`red${i}`]) redAlliance.push(data[`red${i}`]);
              if (data[`blue${i}`]) blueAlliance.push(data[`blue${i}`]);
            }
            
            matches.push({
              number: data.number.toString(),
              time: data.time || null,
              redAlliance,
              blueAlliance,
              redScore: data.redScore !== undefined ? parseInt(data.redScore) : null,
              blueScore: data.blueScore !== undefined ? parseInt(data.blueScore) : null
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
    
    // Save matches to the season
    if (matches.length > 0) {
      await Season.addMatches(req.params.id, matches);
    }
    
    res.json({
      message: `Import complete. ${matches.length} matches imported, ${skipped} skipped.`,
      imported: matches.length,
      skipped
    });
  } catch (err) {
    console.error('Import matches error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;