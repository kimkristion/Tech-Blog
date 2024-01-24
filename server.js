// Import required modules
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

// Create an Express application
const app = express();

// Set the port to either the environment port or 3001
const PORT = process.env.PORT || 3001;

// Import Sequelize for database connection
const sequelize = require("./config/connection");
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Configure session
const sess = {
  secret: 'Super secret secret',  // Secret key for session encryption
  cookie: {},  // Cookie configuration (default settings)
  resave: false,  // Don't save session if unmodified
  saveUninitialized: true,  // Save new sessions
  store: new SequelizeStore({
    db: sequelize  // Store sessions in Sequelize (database)
  })
};

// Use session middleware with the defined configuration
app.use(session(sess));

// Import handlebars helpers
const helpers = require('./utils/helpers');

// Create an instance of handlebars engine with helpers
const hbs = exphbs.create({ helpers });

// Set handlebars as the view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the controllers defined in the 'controllers' directory
app.use(require('./controllers/'));

// Sync Sequelize with the database and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening at localhost:${PORT}`));
});
