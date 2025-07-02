import express from 'express';

const indexApp = express();

indexApp.use(express.json());
indexApp.use(express.Router());

indexApp.get('/', (req, res) => {
    res.send('API is running on http://localhost:3001/api/v1 using routing');
});

export default indexApp;