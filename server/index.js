const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const port = process.env.PORT || 5000;

// Mongo DB 설정
const mongoose = require("mongoose");
mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.use(cors());

// application/x-www-form-urlencoded 타입 body 가져오기
app.use(express.urlencoded({ extended: true }));

// application/json 타입 body 가져오기
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", require("./routes/users"));
app.use("/api/video", require("./routes/video"));
app.use("/api/subscribe", require("./routes/subscribe"));

app.use("/uploads", express.static("uploads"));

// 배포 시 참조 할 React 클라이언트 빌드 경로
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(
            path.resolve(__dirname, "../client", "build", "index.html")
        );
    });
}

app.listen(port, () => console.log(`Server listening on port ${port}`));
