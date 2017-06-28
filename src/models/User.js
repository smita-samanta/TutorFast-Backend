import db from '../db';
import bcrypt from 'bcrypt';

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

userSchema.methods.authenticate = async function (password) {
  return await bcrypt.compare(password, this.passwordDigest);
};

export default db.model('User', userSchema);
