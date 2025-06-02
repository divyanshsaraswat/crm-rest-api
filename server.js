console.log("Starting server setup...");
const app = require('./src/app');
console.log("App imported.");

const dotenv = require('dotenv');
dotenv.config();
console.log("Env loaded.");

const PORT = process.env.PORT;
console.log(`Listening on PORT: ${PORT}`);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});