import db from 'mongoose';
import dotenv from 'dotenv-safe';

dotenv.load();

console.log(process.env.DB_URI + 'slkdjfslkdfj');

db.connect(process.env.DB_URI);

export default db;
