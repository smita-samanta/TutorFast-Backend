import db from 'mongoose';
import { DB_URI } from './config';

db.connect(DB_URI);

export default db;
