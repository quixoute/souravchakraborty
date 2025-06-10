const express = require('express');
const { Client } = require('basic-ftp');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/connectFtp', async (req, res) => {
    const { host, user, password } = req.body;
    const client = new Client();

    try {
        await client.access({
            host: host,
            user: user,
            password: password,
            secure: false // or true for FTPS
        });
        console.log('Connected to FTP server');
        // Here you might want to perform operations like list, upload, download
        let list = await client.list();
        res.json({ success: true, files: list });
    } catch (err) {
        console.error('Error connecting to FTP:', err);
        res.status(500).json({ success: false, error: err.message });
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});