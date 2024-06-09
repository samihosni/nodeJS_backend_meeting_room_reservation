const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config(); // Charger les variables d'environnement

const app = express();

// Connecter à la base de données
connectDB();

// Middleware pour analyser le corps des requêtes en JSON
app.use(express.json());
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index');
});


// Définir les routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/reservations', require('./routes/reservations'));

module.exports = app;
