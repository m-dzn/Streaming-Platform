import React, { useState } from "react";
import { Avatar, Comment, Input } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;

function SingleComment({ comment, refreshFunction, videoId }) {
    const user = useSelector((state) => state.user);

    const [openReply, setOpenReply] = useState(false);
    const [commentValue, setCommentValue] = useState("");

    const onClickReplyOpen = () => {
        setOpenReply((state) => !state);
    };

    const onHandleChange = (e) => {
        setCommentValue(e.currentTarget.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            videoId,
            responseTo: comment._id,
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

        setOpenReply(false);
    };

    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
            Reply to
        </span>,
    ];

    if (!comment) return <div></div>;

    return (
        <div>
            <Comment
                actions={actions}
                author={comment.writer.name}
                avatar={
                    <Avatar src={comment.writer.image} alt="writer image" />
                }
                content={<p>{comment.content}</p>}
            />
            {openReply && (
                <form style={{ display: "flex" }} onSubmit={onSubmit}>
                    <textarea
                        style={{ width: "100%", borderRadius: "5px" }}
                        onChange={onHandleChange}
                        value={commentValue}
                        placeholder="코멘트를 작성해주세요"
                    />
                    <br />
                    <button
                        style={{ width: "20%", height: "52px" }}
                        onClick={onSubmit}
                    >
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
}

export default SingleComment;
