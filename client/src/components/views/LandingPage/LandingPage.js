import { Avatar, Card, Col, Row, Typography } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
    const [video, setVideo] = useState([]);
    useEffect(() => {
        axios.get("/api/video/getVideos").then((response) => {
            if (response.data.success) {
                console.log(response.data.videos);
                setVideo(response.data.videos);
            } else {
                alert("비디오 가져오기를 실패했습니다.");
            }
        });
    }, []);

    const renderCards = video.map((video, index) => {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration - minutes * 60);

        return (
            <Col lg={6} md={8} xs={24} key={video._id}>
                <div style={{ position: "relative" }}>
                    <a href={`/video/${video._id}`}>
                        <img
                            style={{ width: "100%" }}
                            src={`http://localhost:5000/${video.thumbnail}`}
                            alt="video_thumbnail"
                        />
                        <div className="duration">
                            <span>
                                {minutes} : {seconds}
                            </span>
                        </div>
                    </a>
                </div>
                <br />
                <Meta
                    avatar={<Avatar src={video.writer.image} />}
                    title={video.title}
                    description=""
                />
                <span>{video.writer.name}</span>
                <br />
                <span style={{ marginLeft: "3rem" }}>
                    {video.views} views
                </span>{" "}
                - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
            </Col>
        );
    });

    return (
        <div style={{ width: "85%", margin: "3rem auto" }}>
            <Title level={2}>Recommended</Title>
            <hr />
            <Row gutter={[32, 16]}>{renderCards}</Row>
        </div>
    );
}

export default LandingPage;
