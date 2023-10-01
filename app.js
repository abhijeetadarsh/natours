const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json()); // this is middleware
/* Middleware functions are functions that have access to the request object ( req ), the response object
( res ), and the next middleware function in the application's request-response cycle */

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        results: tours.length, // metadata if we are sending an array
        data: {
            // tours: tours // below line and this line both do the same
            tours,
        },
        // ^ this format is called jsent format
    });
};

const getTour = (req, res) => {
    // console.log(req.params); // req.params store all the parameters of the url i.e. 'id' here

    const id = Number(req.params.id);
    // const id = req.params.id * 1; // another way do the same as above

    const tour = tours.find((ele) => ele.id === id);

    // if(id >= tours.length || id < 0) {
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
};
const createTour = (req, res) => {
    // console.log(req.body);
    // body should be a property of req because we used the middleware l.no 6

    const newId = tours.at(-1).id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            if (err) return console.log(err.message);
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
    );

    // res.send('Done'); // we must send st to complete the req-res cycle
};
const updateTour = (req, res) => {
    const id = req.params.id * 1;
    if (id >= tours.length || id < 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here ....>',
        },
    });
};
const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    if (id >= tours.length || id < 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
};

// this is also a middleware
// middleware always execute in order they are written
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.use((req, res, next) => {
    console.log('Hello from middleware');
    next();
    // thats why this middle will not run if we get/post request come to '/api/v1/tours'
    // because the route handler above end the req-res cycle
});

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
