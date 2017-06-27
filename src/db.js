import db from 'mongoose';

db.connect(process.env.DB_URI);

export default db;
