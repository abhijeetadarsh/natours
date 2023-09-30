const express = require('express');
const fs = require('fs');

const app = express();

// app.get('/', (req, res) => {
//     // res.status(200).send('Hello from the server side');
//     res
//         .status(200)
//         .json({"message": 'Hello from the server side', "app":'natours'});
//         // ^ this by default set content type to json
// });

// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint.....');
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

app.get('/api/v1/tours', (req, res) => {
    res
        .status(200)
        .json({
            status: 'success',
            results: tours.length, // metadata if we are sending an array
            data: {
                // tours: tours // below line and this line both do the same
                tours
            }
            // ^ this format is called jsent format
        });
});

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});