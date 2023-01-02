const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// HOW TO CONNECT TO CLOUD DB BELOW!!!
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful');
  });

// HOW TO CONNECT TO LOCAL DB BELOW!!!

// mongoose
// .connect(process.env.DATABASE_LOCAL, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// })
// .then(() => {
//   console.log('DB connection successful');
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port:`, port);
});

//Test