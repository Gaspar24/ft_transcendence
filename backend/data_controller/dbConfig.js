import knex from 'knex'; // Use import
import config from './knexfile.js'; // Use import, add .js extension

const DB = knex(config.development);
// npx knex migrate:make tests  //creates the data folder migration
export default DB; // Use export default