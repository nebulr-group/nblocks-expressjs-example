const express = require('express')
const app = express()
const port = 3000

const { jwtMiddleware, protectedRoute } = require('./protection-middlewares');
const { featureFlag } = require('./feature-flag-middleware');

// First middleware that decodes tokens for all endpoints globally
app.use("*", jwtMiddleware);

// Restrict all endpoints globally with protectedRoute to require authenticated users
app.use("*", protectedRoute({ privileges: 'AUTHENTICATED' }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Get data now uses flag "analytics"
app.get('/getData', featureFlag({ flag: "analytics" }), (req, res) => {
    res.send(_randomFill(3, 0, 1));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Generate random data
const _randomFill = (amount, min, max) => {
    const arr = [];
    let total = 0;

    // fill an array with random numbers
    for (let i = 0; i < amount; i++) arr.push(_random(min, max));

    // add up all the numbers
    for (let i = 0; i < amount; i++) total += arr[i];

    // normalise so numbers add up to 1
    for (let i = 0; i < amount; i++) arr[i] /= total;

    return arr;
}

const _random = (min, max) => {
    return min + Math.random() * (max - min);
}