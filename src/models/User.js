import db from '../db';
import bcrypt from 'bcrypt';
import { JWT_SECRET, TOKEN_LIFE } from '../config';
import { pjwt } from '../util';

const userSchema = db.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  passwordDigest: {
    type: String,
    required: true,
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordDigest;
  delete user.__v;
  return user;
};

userSchema.methods.authenticate = function (password) {
  return bcrypt.compare(password, this.passwordDigest)

    // reject if comare fails and produce a token on success.
    .then(match => match
      ? pjwt.sign({ _id: this._id }, JWT_SECRET, TOKEN_LIFE)
      : Promise.reject('Password mismatch.')
    )
  ;
};

export default db.model('User', userSchema);
