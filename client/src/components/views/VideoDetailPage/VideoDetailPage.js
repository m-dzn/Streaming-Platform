import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";
import LikeDislikes from "./Sections/LikeDislikes";

function VideoDetailPage() {
    const { videoId } = useParams();
    const userId = localStorage.getItem("userId");
    const variable = { videoId };

    const [videoDetail, setVideoDetail] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios.post("/api/video/getVideoDetail", variable).then((response) => {
            if (response.data.success) {
                console.log(response.data);
                setVideoDetail(response.data.videoDetail);
            } else {
                alert("비디오 정보를 가져오는 데 실패했습니다.");
            }
        });

        axios.get("/api/comment/getComments", variable).then((response) => {
            if (response.data.success) {
                setComments(response.data.comments);
                console.log(response.data.comments);
            } else {
                alert("댓글 정보를 가져오는 데 실패했습니다.");
            }
        });
    }, []);

    const refreshFunction = (newComment) => {
        setComments(comments.concat(newComment));
    };

    if (!videoDetail.writer) return <div>...loading</div>;

    const subscribeButton = videoDetail.writer._id !== userId && (
        <Subscribe userTo={videoDetail.writer._id} userFrom={userId} />
    );

    return (
        <Row gutter={[16, 16]}>
            <Col lg={18} xs={24}>
                <div style={{ width: "100%", padding: "3rem 4rem" }}>
                    <video
                        style={{ width: "100%" }}
                        src={`http://localhost:5000/${videoDetail.filePath}`}
                        controls
                    />

                    <List.Item
                        actions={[
                            <LikeDislikes
                                video
                                userId={userId}
                                videoId={videoId}
                            />,
                            subscribeButton,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={videoDetail.writer.image} />}
                            title={videoDetail.writer.name}
                            description={videoDetail.description}
                        />
                    </List.Item>

                    <Comment
                        commentList={comments}
                        refreshFunction={refreshFunction}
                        videoId={videoId}
                    />
                </div>
            </Col>
            <Col lg={6} xs={24}>
                <SideVideo />
            </Col>
        </Row>
    );
}

export default VideoDetailPage;
