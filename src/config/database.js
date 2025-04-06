const mongoose = require('mongoose');
const connectDB = async () => {
    await mongoose.connect('mongodb+srv://naveenverma440:naveen787@namastedev.u3pm1.mongodb.net/devTinder', {useNewUrlParser: true, useUnifiedTopology: true});
}

module.exports = connectDB;
connectDB().then((result) => {
    console.log('database connected');
}).catch((err) => {
    console.log(err);
});
