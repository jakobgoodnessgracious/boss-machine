const checkMillionDollarIdea = (req, res, next) => {
    const { numWeeks, weeklyRevenue } = req.body;
    const million = 1000000;
    if (typeof numWeeks !== 'number') {
        res.status(400).send('[numWeeks] must be a number.');
    } else if (typeof weeklyRevenue !== 'number') {
        res.status(400).send('[numWeeks] must be a number.');
    } else if (numWeeks * weeklyRevenue < million) {
        res.status(400).send('[numWeeks] must be a number.');
    } else {
        next();
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
