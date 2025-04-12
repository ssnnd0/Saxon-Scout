import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormInput from '../../components/common/FormInput';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import { ScoutingContext } from '../../context/ScoutingContext';
import apiService from '../../utils/apiService';

const DataManagement = () => {
  const navigate = useNavigate();
  const { currentSeason, teams } = React.useContext(ScoutingContext);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [exportFormat, setExportFormat] = useState('csv');
  const [importFile, setImportFile] = useState(null);
  const [dataStats, setDataStats] = useState({
    totalMatches: 0,
    totalTeams: 0,
    dataPoints: 0,
    lastUpdated: null
  });
  const [seasonsList, setSeasonsList] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  
  // Fetch stats and seasons on component mount
  useEffect(() => {
    fetchDataStats();
    fetchSeasons();
    
    // Set default selected season
    if (currentSeason?.id) {
      setSelectedSeason(currentSeason.id);
    }
  }, [currentSeason]);
  
  const fetchDataStats = async () => {
    try {
      setLoading(true);
      const stats = await apiService.getScoutingDataStats();
      setDataStats(stats);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch data statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSeasons = async () => {
    try {
      const seasons = await apiService.getSeasons();
      setSeasonsList(seasons);
    } catch (err) {
      console.error("Failed to fetch seasons:", err);
    }
  };
  
  const handleExportData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const seasonId = selectedSeason || currentSeason?.id;
      
      if (!seasonId) {
        throw new Error("No season selected for export");
      }
      
      // Generate filename with season and date
      const season = seasonsList.find(s => s.id === seasonId);
      const seasonName = season?.name || 'unknown-season';
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `saxons-scouting-${seasonName}-${dateStr}.${exportFormat}`;
      
      // Call API to export data
      const blob = await apiService.exportScoutingData(seasonId, exportFormat);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      setSuccess(`Data exported successfully as ${filename}`);
    } catch (err) {
      setError(`Export failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImportFile(file);
  };
  
  const handleImportData = async () => {
    if (!importFile) {
      setError("Please select a file to import");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Check file extension
      const fileExt = importFile.name.split('.').pop().toLowerCase();
      if (fileExt !== 'csv' && fileExt !== 'json') {
        throw new Error("Only CSV and JSON files are supported");
      }
      
      const seasonId = selectedSeason || currentSeason?.id;
      
      if (!seasonId) {
        throw new Error("No season selected for import");
      }
      
      const result = await apiService.importScoutingData(importFile, seasonId, fileExt);
      
      // Clear the file input
      setImportFile(null);
      document.getElementById('file-upload').value = '';
      
      // Refresh stats
      await fetchDataStats();
      
      setSuccess(`Successfully imported ${result.imported} records. ${result.skipped || 0} records were skipped.`);
    } catch (err) {
      setError(`Import failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearData = async () => {
    if (!confirm('WARNING: This will permanently delete ALL scouting data for the selected season. This action cannot be undone. Are you sure you want to continue?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const seasonId = selectedSeason || currentSeason?.id;
      
      if (!seasonId) {
        throw new Error("No season selected");
      }
      
      await apiService.clearScoutingData(seasonId);
      
      // Refresh stats
      await fetchDataStats();
      
      setSuccess("All scouting data has been cleared for the selected season");
    } catch (err) {
      setError(`Failed to clear data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleImportTeams = async () => {
    if (!importFile) {
      setError("Please select a file to import teams");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Check file extension
      const fileExt = importFile.name.split('.').pop().toLowerCase();
      if (fileExt !== 'csv' && fileExt !== 'json') {
        throw new Error("Only CSV and JSON files are supported");
      }
      
      const seasonId = selectedSeason || currentSeason?.id;
      
      if (!seasonId) {
        throw new Error("No season selected for team import");
      }
      
      const result = await apiService.importTeams(importFile, seasonId, fileExt);
      
      // Clear the file input
      setImportFile(null);
      document.getElementById('file-upload').value = '';
      
      // Refresh stats
      await fetchDataStats();
      
      setSuccess(`Successfully imported ${result.imported} teams. ${result.skipped || 0} teams were skipped.`);
    } catch (err) {
      setError(`Team import failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Data Management</h1>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
      
      {loading && <Spinner size="medium" />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      {/* Data Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <h3 className="text-lg text-gray-400">Total Matches</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">{dataStats.totalMatches}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg text-gray-400">Teams Covered</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">{dataStats.totalTeams}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg text-gray-400">Data Points</h3>
            <p className="text-3xl font-bold text-purple-400 mt-2">{dataStats.dataPoints}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg text-gray-400">Last Updated</h3>
            <p className="text-xl font-bold text-yellow-400 mt-2">
              {dataStats.lastUpdated 
                ? new Date(dataStats.lastUpdated).toLocaleDateString()
                : 'Never'}
            </p>
          </div>
        </Card>
      </div>
      
      {/* Season Selection */}
      <Card title="Season Selection">
        <FormInput
          id="season-select"
          label="Select Season"
          type="select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          placeholder="Choose a season"
          options={seasonsList.map(season => ({
            value: season.id,
            label: season.name
          }))}
        />
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Data */}
        <Card title="Export Data">
          <div className="space-y-4">
            <p className="text-gray-300">Export scouting data for the selected season in your preferred format.</p>
            <FormInput
              id="export-format"
              label="Export Format"
              type="select"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              options={[
                { value: 'csv', label: 'CSV (Excel Compatible)' },
                { value: 'json', label: 'JSON' }
              ]}
            />
            <Button 
              variant="primary" 
              onClick={handleExportData} 
              disabled={loading || !selectedSeason}
              fullWidth
            >
              Export Data
            </Button>
          </div>
        </Card>
        
        {/* Import Data */}
        <Card title="Import Data">
          <div className="space-y-4">
            <p className="text-gray-300">Import scouting data from CSV or JSON file.</p>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Upload File
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-gray-700 file:text-gray-300
                  hover:file:bg-gray-600
                  cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Button 
                variant="success" 
                onClick={handleImportData} 
                disabled={loading || !importFile || !selectedSeason}
                fullWidth
              >
                Import Scouting Data
              </Button>
              <Button 
                variant="info" 
                onClick={handleImportTeams} 
                disabled={loading || !importFile || !selectedSeason}
                fullWidth
              >
                Import Teams Data
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Data Management Actions */}
      <Card title="Advanced Actions" className="bg-gray-800">
        <div className="space-y-4">
          <div className="border-l-4 border-yellow-500 bg-yellow-900/30 p-4 rounded-md">
            <h3 className="text-lg font-medium text-yellow-300">Warning</h3>
            <p className="text-gray-300 mt-1">
              The actions below are destructive and cannot be undone. Make sure to export your data before performing these operations.
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="text-lg font-medium text-red-400 mb-2">Clear Scouting Data</h3>
            <p className="text-gray-300 mb-4">
              This will permanently delete all scouting data for the selected season. This action cannot be undone.
            </p>
            <Button 
              variant="danger" 
              onClick={handleClearData}
              disabled={loading || !selectedSeason}
            >
              Clear All Scouting Data
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Data Format Guide */}
      <Card title="Data Format Guidelines">
        <div className="space-y-4">
          <p className="text-gray-300">When importing data, ensure your files follow these formats:</p>
          
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="font-medium text-blue-300 mb-2">Scouting Data (CSV)</h3>
            <p className="text-gray-300 mb-2">CSV files should have headers and include the following columns:</p>
            <code className="block bg-gray-800 p-3 rounded text-sm text-gray-300 overflow-x-auto">
              teamNumber,matchNumber,alliance,autoScore,teleopScore,[custom fields...]
            </code>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="font-medium text-blue-300 mb-2">Team Data (CSV)</h3>
            <p className="text-gray-300 mb-2">Team import files should include the following columns:</p>
            <code className="block bg-gray-800 p-3 rounded text-sm text-gray-300 overflow-x-auto">
              number,name,location,website,rookieYear
            </code>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="font-medium text-blue-300 mb-2">JSON Format</h3>
            <p className="text-gray-300 mb-2">JSON files should be arrays of objects with the appropriate fields.</p>
            <p className="text-gray-300">See the exported files for examples of the correct format.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DataManagement;