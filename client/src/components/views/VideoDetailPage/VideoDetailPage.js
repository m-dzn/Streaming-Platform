import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import SideVideo from "./Sections/SideVideo";

function VideoDetailPage() {
    const { videoId } = useParams();
    const variable = { videoId };

    const [videoDetail, setVideoDetail] = useState([]);

    useEffect(() => {
        axios.post("/api/video/getVideoDetail", variable).then((response) => {
            if (response.data.success) {
                console.log(response.data);
                setVideoDetail(response.data.videoDetail);
            } else {
                alert("비디오 정보를 가져오길 실패했습니다.");
            }
        });
    }, []);

    if (!videoDetail.writer) return <div>...loading</div>;

    return (
        <Row gutter={[16, 16]}>
            <Col lg={18} xs={24}>
                <div style={{ width: "100%", padding: "3rem 4rem" }}>
                    <video
                        style={{ width: "100%" }}
                        src={`http://localhost:5000/${videoDetail.filePath}`}
                        controls
                    />

                    <List.Item actions>
                        <List.Item.Meta
                            avatar={<Avatar src={videoDetail.writer.image} />}
                            title={videoDetail.writer.name}
                            description={videoDetail.description}
                        />
                    </List.Item>
                </div>
            </Col>
            <Col lg={6} xs={24}>
                <SideVideo />
            </Col>
        </Row>
    );
}

export default VideoDetailPage;
