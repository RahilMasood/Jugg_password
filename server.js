const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from current directory (includes public folder)
app.use(express.static(__dirname));

// Serve index.html for all routes (SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Password Tool Frontend running on port ${PORT}`);
  console.log(`API URL configured: https://userauth.verityaudit.in/api/v1`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

