import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ReplyComment from "./ReplyComment";
import SingleComment from "./SingleComment";

function Comment({ commentList, refreshFunction, videoId }) {
    const user = useSelector((state) => state.user);

    const [commentValue, setCommentValue] = useState("");

    const handleClick = (e) => {
        setCommentValue(e.currentTarget.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            videoId,
        };

        axios.post("/api/comment/saveComment", variables).then((response) => {
            if (response.data.success) {
                console.log(response.data.result);
                setCommentValue("");
                refreshFunction(response.data.result);
            } else {
                alert("댓글을 저장하지 못했습니다.");
            }
        });
    };

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/* Comment Lists */}
            {commentList &&
                commentList.map(
                    (comment, index) =>
                        !comment.responseTo && (
                            <div key={comment._id}>
                                <SingleComment
                                    comment={comment}
                                    refreshFunction={refreshFunction}
                                    videoId={videoId}
                                />
                                <ReplyComment
                                    parentCommentId={comment._id}
                                    commentList={commentList}
                                    refreshFunction={refreshFunction}
                                    videoId={videoId}
                                />
                            </div>
                        )
                )}

            {/* Root Comment Form */}

            <form style={{ display: "flex" }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: "100%", borderRadius: "5px" }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <button
                    style={{ width: "20%", height: "52px" }}
                    onClick={onSubmit}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Comment;
