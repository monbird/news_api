const express = require('express');
const request = require('request');
const body_parser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(body_parser.json());
app.use(
    body_parser.urlencoded({
        extended: true,
    })
);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.post('/news-proxy', (req, res) => {
    const url = req.body.url;
    const api_key = process.env.API_KEY;
    request(
        {
            headers: {
                'User-Agent': 'Monbird/1.0',
            },
            url: url + '&apiKey=' + api_key,
        },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({
                    type: 'error',
                    message: error ? error.message : 'Internal Server Error',
                });
            }
            res.json(JSON.parse(body));
        }
    );
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
