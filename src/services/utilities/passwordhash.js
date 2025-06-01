const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
async function comparePassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

// (async () => {
//   const output = await comparePassword("admin123","$2b$10$myZsIWrnHhLOLc23TApUc.TB0FeTSR3Pb0z/iAhRAxctoEewFrQbS");
//   console.log(output);
// })();

module.exports = {hashPassword, comparePassword};