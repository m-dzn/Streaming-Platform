const express = require("express");
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

// ==========================
//            Like
// ==========================

router.post("/getLikes", (req, res) => {
    let variables = {};

    if (req.body.videoId) {
        variables = { videoId: req.body.videoId };
    } else {
        variables = { commentId: req.body.commentId };
    }

    Like.find(variables).exec((err, likes) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, likes });
    });
});

router.post("/getDislikes", (req, res) => {
    let variables = {};

    if (req.body.videoId) {
        variables = { videoId: req.body.videoId, userId: req.body.userId };
    } else {
        variables = { commentId: req.body.commentId, userId: req.body.userId };
    }

    Dislike.find(variables).exec((err, dislikes) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, dislikes });
    });
});

router.post("/upLike", (req, res) => {
    let variables = {};

    if (req.body.videoId) {
        variables = { videoId: req.body.videoId, userId: req.body.userId };
    } else {
        variables = { commentId: req.body.commentId, userId: req.body.userId };
    }

    // Like collection에 클릭 정보를 추가
    const like = new Like(variables);
    like.save((err, likeResult) => {
        if (err) return res.json({ success: false, err });

        // 만약 Dislike이 이미 클릭돼 있으면, Dislike 1 감소
        Dislike.findOneAndDelete(variables).exec((err, dislikeResult) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({ success: true });
        });
    });
});

router.post("/unLike", (req, res) => {
    let variables = {};

    if (req.body.videoId) {
        variables = { videoId: req.body.videoId, userId: req.body.userId };
    } else {
        variables = { commentId: req.body.commentId, userId: req.body.userId };
    }

    Like.findOneAndDelete(variables).exec((err, result) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true });
    });
});

router.post("/upDislike", (req, res) => {
    let variables = {};

    if (req.body.videoId) {
        variables = { videoId: req.body.videoId, userId: req.body.userId };
    } else {
        variables = { commentId: req.body.commentId, userId: req.body.userId };
    }

    const dislike = new Dislike(variables);

    dislike.save((err, dislikeResult) => {
        if (err) return res.json({ success: false, err });

        // 만약 Like이 이미 클릭돼 있다면, Like 1 감소
        Dislike.findOneAndDelete(variables).exec((err, disLikeResult) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({ success: true });
        });
    });
});

router.post("/unDislike", (req, res) => {
    let variables = {};

    if (req.body.videoId) {
        variables = { videoId: req.body.videoId, userId: req.body.userId };
    } else {
        variables = { commentId: req.body.commentId, userId: req.body.userId };
    }

    Dislike.findOneAndDelete(variables).exec((err, result) => {
        console.log(err);
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true });
    });
});

module.exports = router;
