const express = require('express');

const app = express();

app.use(express.json());

app.use('/', (req,res,next) => {

    return res.status(200).json({"msg": "Hello from Products-Service"})
})


app.listen(5000, () => {
    console.log('Products is Listening to Port 5000')
})