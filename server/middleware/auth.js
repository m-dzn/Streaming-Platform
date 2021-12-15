const { User } = require("../models/User");

let auth = (req, res, next) => {
    // 인증 처리
    // 클라이언트 쿠키에서 토큰 읽기
    let token = req.cookies.w_auth;

    // 토큰 복호화 후 User 찾기
    User.findByToken(token, (err, user) => {
        if (err) throw err;

        // 유저가 존재하지 않으면 인증 실패
        if (!user) return res.json({ isAuth: false, error: true });

        // 유저가 존재하면 인증 성공
        req.token = token;
        req.user = user;
        next();
    });
};

module.exports = { auth };
