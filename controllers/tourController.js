const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.checkID = (req, res, next, val) => {
    const id = req.params.id * 1;
    if (id >= tours.length || id < 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }
    next();
};

exports.checkBody = (req, res, next) => {
    const newTour = req.body;

    if (!newTour.name || !newTour.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'missing name or price',
        });
    }
    next();
};

// ROUTE HANDLERS
exports.getAllTours = (req, res) => {
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

exports.getTour = (req, res) => {
    // console.log(req.params); // req.params store all the parameters of the url i.e. 'id' here

    const id = Number(req.params.id);
    // const id = req.params.id * 1; // another way do the same as above

    const tour = tours.find((ele) => ele.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
};
exports.createTour = (req, res) => {
    const newId = tours.at(-1).id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`,
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
exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here ....>',
        },
    });
};
exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
