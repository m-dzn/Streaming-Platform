import React, { useEffect, useState } from "react";
import SingleComment from "./SingleComment";

function ReplyComment({
    parentCommentId,
    commentList,
    refreshFunction,
    videoId,
}) {
    const [childCommentNumber, setChildCommentNumber] = useState(0);
    const [openReplyComments, setOpenReplyComments] = useState(false);

    useEffect(() => {
        let commentNumber = 0;
        commentList.forEach((comment) => {
            if (comment.responseTo === parentCommentId) {
                commentNumber++;
            }
        });

        setChildCommentNumber(commentNumber);
    }, [commentList]);

    const renderReplyComment = (parentCommentId) =>
        commentList.map((comment, index) => (
            <>
                {comment.responseTo === parentCommentId && (
                    <div style={{ width: "80%", marginLeft: "40px" }}>
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
                )}
            </>
        ));

    const onHandleChange = () => {
        setOpenReplyComments((state) => !state);
    };

    return (
        <div>
            {childCommentNumber > 0 && (
                <p
                    style={{ fontSize: "14px", margin: 0, color: "gray" }}
                    onClick={onHandleChange}
                >
                    View {childCommentNumber} more comment(s)
                </p>
            )}

            {openReplyComments && renderReplyComment(parentCommentId)}
        </div>
    );
}

export default ReplyComment;
