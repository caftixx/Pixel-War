const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const gridSize = 200;
const pixelSize = 10;

const colors = [
  '#0000FF', '#FF0000', '#FFFFFF', '#000000', 
  '#00FF00', '#FFFF00', '#FFA500', '#FF69B4'
];

// Initialiser grille toute blanche
const grid = [];
for(let i=0; i<gridSize; i++) {
  grid[i] = [];
  for(let j=0; j<gridSize; j++) {
    grid[i][j] = '#FFFFFF';
  }
}

app.use(express.static('public')); // dossier frontend

io.on('connection', (socket) => {
  // Envoyer la grille complète au nouveau client
  socket.emit('gridData', grid);

  // Quand un client pose un pixel
  socket.on('paintPixel', ({x, y, color}) => {
    if(x >= 0 && x < gridSize && y >= 0 && y < gridSize && colors.includes(color)) {
      grid[x][y] = color;
      // Envoyer la mise à jour à tous
      io.emit('pixelUpdate', {x, y, color});
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
