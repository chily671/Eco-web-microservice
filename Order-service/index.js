const express = require('express');

const app = express();

app.use(express.json());

app.use('/', (req,res,next) => {

    return res.status(200).json({"msg": "Hello from Order-Service"})
})


app.listen(5002, () => {
    console.log('Shopping is Listening to Port 5002')
})