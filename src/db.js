import db from 'mongoose';
import { DB_URI } from './config';

db.Promise = Promise;
db.connect(DB_URI);

export default db;
