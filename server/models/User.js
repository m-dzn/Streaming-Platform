const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const moment = require("moment");

const secretKey = "jwtSecret";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  toeknExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  const user = this;

  // 비밀번호 암호화
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plain PW와 DB PW 비교하기
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);

    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  const user = this;

  // JWT 토큰 생성
  const token = jwt.sign(user._id.toHexString(), secretKey);
  const oneHour = moment().add(1, "hour").valueOf();

  user.tokenExp = oneHour;
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  const user = this;

  // 토큰을 decode 한다.
  jwt.verify(token, secretKey, function (err, decoded) {
    // 유저 아이디를 이용해 유저를 찾은 다음
    // 클라이언트 토큰과 DB 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token }, function (err, user) {
      if (err) return cb(err);

      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
