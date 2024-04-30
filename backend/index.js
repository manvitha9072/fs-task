// express-server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb+srv://manvitha_m:umes%401234@cluster0.bvfldq6.mongodb.net/counter_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define counter schema and model
const counterSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
    myCount: { type: Number, default: 0 }
}, { collection: 'counters' });

const Counter = mongoose.model('Counter', counterSchema);

// Routes
// Existing endpoints for count
app.get('/api/counter', async (req, res) => {
    try {
        const counter = await Counter.findOne();
        if (!counter) {
            return res.status(404).json({ message: 'Counter not found' });
        }
        res.json({ count: counter.count, myCount: counter.myCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/counter/increment', async (req, res) => {
    try {
        const counter = await Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
        res.json({ count: counter.count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/counter/decrement', async (req, res) => {
    try {
        const counter = await Counter.findOneAndUpdate({}, { $inc: { count: -1 } }, { new: true, upsert: true });
        res.json({ count: counter.count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// New endpoints for myCount
app.post('/api/mycounter/increment', async (req, res) => {
    try {
        const counter = await Counter.findOneAndUpdate({}, { $inc: { myCount: 1 } }, { new: true, upsert: true });
        res.json({ myCount: counter.myCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/mycounter/decrement', async (req, res) => {
    try {
        const counter = await Counter.findOneAndUpdate({}, { $inc: { myCount: -1 } }, { new: true, upsert: true });
        res.json({ myCount: counter.myCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});