const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");

const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

// Multer 설정
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 파일 저장 경로 지정
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // 저장될 파일명 지정
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        // 저장할 파일 확장자 필터링
        const ext = path.extname(file.originalname);
        if (ext !== ".mp4") {
            return cb(res.status(400).end("only mp4 is allowed"), false);
        }
        cb(null, true);
    },
});

const upload = multer({ storage: storage }).single("file");

// ==========================
//           Video
// ==========================

router.post("/uploadfiles", (req, res) => {
    // 비디오를 서버에 저장한다.
    upload(req, res, (err) => {
        if (err) {
            return res.json({ success: false, err });
        }

        return res.json({
            success: true,
            url: res.req.file.path,
            fileName: res.req.file.filename,
        });
    });
});

router.post("/getVideoDetail", (req, res) => {
    Video.findOne({ _id: req.body.videoId })
        .populate("writer")
        .exec((err, videoDetail) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, videoDetail });
        });
});

router.post("/uploadVideo", (req, res) => {
    // 비디오 정보들을 저장한다.
    const video = new Video(req.body);

    video.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});

router.post("/getSubscriptionVideos", (req, res) => {
    console.log(req.body);
    // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
    Subscriber.find({ userFrom: req.body.userFrom }).exec(
        (err, subscriberInfo) => {
            if (err) return res.status(400).send(err);

            let subscribedUser = [];
            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo);
            });

            // 찾은 사람들의 비디오를 가지고 온다.
            Video.find({ writer: { $in: subscribedUser } })
                .populate("writer")
                .exec((err, videos) => {
                    if (err) return res.status(400).send(err);
                    res.status(200).json({ success: true, videos });
                });
        }
    );
});

router.get("/getVideos", (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에 보낸다.
    Video.find()
        .populate("writer")
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos });
        });
});

router.post("/thumbnail", (req, res) => {
    let filePath = "";
    let fileDuration = "";

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    });

    // 썸네일 생성
    ffmpeg(req.body.url) // 저장된 비디오의 경로
        // 썸네일 파일명 생성
        .on("filenames", function (filenames) {
            console.log("Will generate " + filenames.join(", "));
            console.log(filenames);

            filePath = "uploads/thumbnails/" + filenames[0];
        })
        // 썸네일 생성 후의 동작 지정
        .on("end", function () {
            console.log("Screenshots taken");
            return res.json({
                success: true,
                url: filePath,
                duration: fileDuration, // 비디오 러닝 타임
            });
        })
        // 에러 발생 시의 동작 지정
        .on("error", function (err) {
            console.error(err);
            return res.json({ success: false, err });
        })
        // 썸네일 옵션 지정
        .screenshots({
            count: 3,
            folder: "uploads/thumbnails",
            size: "?x240",
            filename: "thumbnail-%b.png",
        });
});

module.exports = router;
