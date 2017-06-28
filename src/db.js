import db from 'mongoose';
import dotenv from 'dotenv-safe';

dotenv.load();

db.connect(process.env.DB_URI);

export default db;
