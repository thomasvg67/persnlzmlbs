const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const createDailyAlerts = require("./middleware/crnJbAlrt");

dotenv.config();

const app = express();
// app.use(cors({
//   origin: 'https://crm.zoomlabs.in', // or use '*' for testing (not for production)
//   credentials: true // if using cookies or auth headers
// }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/pdfs', express.static(path.join(__dirname, 'uploads/pdfs')));
app.use('/uploads/audio', express.static(path.join(__dirname, 'uploads/audio')));


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {console.log('MongoDB connected');createDailyAlerts();
})
  .catch(err => console.error('MongoDB connection error:', err));
  
// Routes
app.use('/api/notes', require('./routes/notes'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/feedbacks', require('./routes/FdBack'));
app.use('/api/users', require('./routes/users'));
app.use('/api/scrum-board', require('./routes/scrumBoardRoutes'));
app.use('/api/todolist', require('./routes/todolistRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/names', require('./routes/nameRoutes'));
app.use('/api/medical-stats', require('./routes/medicalStatRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/dictionary', require('./routes/dictionaryRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/diary', require('./routes/diaryRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/business', require('./routes/businessIdeaRoutes'));
app.use('/api/mission', require('./routes/missionRoutes'));
app.use('/api/calendar', require('./routes/calendarEventRoutes'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
