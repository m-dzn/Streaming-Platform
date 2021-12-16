import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import {
    LikeOutlined,
    DislikeOutlined,
    LikeFilled,
    DislikeFilled,
} from "@ant-design/icons";
import axios from "axios";

function LikeDislikes({ video, videoId, commentId, userId }) {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [likeAction, setLikeAction] = useState(null);
    const [dislikeAction, setDislikeAction] = useState(null);

    let variables = {};
    if (video) {
        variables = { videoId, userId };
    } else {
        variables = { commentId, userId };
    }
    useEffect(() => {
        axios.post("/api/like/getLikes", variables).then((response) => {
            if (response.data.success) {
                // 얼마나 많은 좋아요를 받았는지
                setLikes(response.data.likes.length);
                // 내가 이미 좋아요를 눌렀는지
                response.data.likes.map((like) => {
                    if (like.userId === userId) {
                        setLikeAction("liked");
                    }
                });
            } else {
                alert("Likes 정보를 가져오지 못했습니다");
            }
        });

        axios.post("/api/like/getDislikes", variables).then((response) => {
            if (response.data.success) {
                // 얼마나 많은 싫어요를 받았는지
                setDislikes(response.data.dislikes.length);
                // 내가 이미 싫어요를 눌렀는지
                response.data.dislikes.map((dislike) => {
                    if (dislike.userId === userId) {
                        setDislikeAction("disliked");
                    }
                });
            } else {
                alert("Dislikes 정보를 가져오지 못했습니다");
            }
        });
    }, []);

    const onLike = () => {
        if (!likeAction) {
            axios.post("/api/like/upLike", variables).then((response) => {
                if (response.data.success) {
                    setLikes((state) => state + 1);
                    setLikeAction("liked");
                    if (dislikeAction !== null) {
                        setDislikeAction(null);
                        setDislikes((state) => state - 1);
                    }
                } else {
                    alert("Like 표시를 하지 못했습니다");
                }
            });
        } else {
            axios.post("/api/like/unLike", variables).then((response) => {
                if (response.data.success) {
                    setLikes((state) => state - 1);
                    setLikeAction(null);
                } else {
                    alert("Like 표시를 취소하지 못했습니다");
                }
            });
        }
    };

    const onDislike = () => {
        if (!dislikeAction) {
            axios.post("/api/like/upDislike", variables).then((response) => {
                if (response.data.success) {
                    setDislikes((state) => state + 1);
                    setDislikeAction("disliked");

                    if (likeAction !== null) {
                        setLikeAction(null);
                        setLikes((state) => state - 1);
                    }
                } else {
                    alert("Dislike 표시를 하지 못했습니다");
                }
            });
        } else {
            axios.post("/api/like/unDislike", variables).then((response) => {
                if (response.data.success) {
                    setDislikes((state) => state - 1);
                    setDislikeAction(null);
                } else {
                    alert("Dislike 표시를 취소하지 못했습니다");
                }
            });
        }
    };

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    {likeAction !== null ? (
                        <LikeFilled onClick={onLike} />
                    ) : (
                        <LikeOutlined onClick={onLike} />
                    )}
                </Tooltip>
                <span style={{ paddingLeft: "8px", cursor: "auto" }}>
                    {likes}
                </span>
            </span>
            &nbsp;&nbsp;
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    {dislikeAction !== null ? (
                        <DislikeFilled onClick={onDislike} />
                    ) : (
                        <DislikeOutlined onClick={onDislike} />
                    )}
                </Tooltip>
                <span style={{ paddingLeft: "8px", cursor: "auto" }}>
                    {dislikes}
                </span>
            </span>
            &nbsp;&nbsp;
        </div>
    );
}

export default LikeDislikes;
