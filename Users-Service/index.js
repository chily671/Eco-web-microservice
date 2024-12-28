const express = require('express');
const { PORT } = require('./src/config');

const app = express();

app.use(express.json());

app.use('/', (req,res,next) => {

    return res.status(200).json({"msg": "Hello from Users-Service "})
})


app.listen(PORT, () => {
    console.log('Products is Listening to Port 5001')
})