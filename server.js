const app = require('./app');
const PORT = process.env.PORT || 5000;
app.set('view engine', 'ejs');


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
