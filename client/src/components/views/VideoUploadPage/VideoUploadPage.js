import { Button, Form, Input, message, Typography } from "antd";
import React, { useState } from "react";
import DropZone from "react-dropzone";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;

const privateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" },
];

const categoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
];

function VideoUploadPage() {
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);

    const [videoTitle, setVideoTitle] = useState("");
    const [description, setDescription] = useState("");
    const [privacy, setPrivacy] = useState(0);
    const [category, setCategory] = useState("Film & Animation");
    const [filePath, setFilePath] = useState("");
    const [duration, setDuration] = useState("");
    const [thumbnailPath, setThumbnailPath] = useState("");

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value);
    };

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value);
    };

    const onPrivateChange = (e) => {
        setPrivacy(e.currentTarget.value);
    };

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value);
    };

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { "content-type": "multipart/form-data" },
        };
        formData.append("file", files[0]);

        axios
            .post("/api/video/uploadfiles", formData, config)
            .then((response) => {
                if (response.data.success) {
                    console.log(response.data);
                    setFilePath(response.data.url);

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName,
                    };

                    axios
                        .post("/api/video/thumbnail", variable)
                        .then((response) => {
                            if (response.data.success) {
                                setDuration(response.data.duration);
                                setThumbnailPath(response.data.url);
                            } else {
                                alert("썸네일 생성에 실패했습니다.");
                            }
                        });
                } else {
                    alert("비디오 업로드를 실패했습니다.");
                }
            });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: videoTitle,
            description,
            privacy,
            filePath,
            category,
            duration,
            thumbnail: thumbnailPath,
        };

        axios.post("/api/video/uploadVideo", variables).then((response) => {
            if (response.data.success) {
                message.success("성공적으로 업로드했습니다.");
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                alert("비디오 업로드에 실패했습니다.");
            }
        });
    };

    return (
        <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit={onSubmit}>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    {/* Drop zone */}
                    <DropZone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={100000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div
                                style={{
                                    width: "300px",
                                    height: "240px",
                                    border: "1px solid lightgray",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <PlusOutlined style={{ fontSize: "3rem" }} />
                            </div>
                        )}
                    </DropZone>

                    {/* Thumbnail */}
                    {thumbnailPath && (
                        <div>
                            <img
                                src={`http://localhost:5000/${thumbnailPath}`}
                                alt="thumbnail"
                            />
                        </div>
                    )}
                </div>
                <br />
                <br />
                <label>Title</label>
                <Input onChange={onTitleChange} value={videoTitle} />
                <br />
                <br />
                <label>Description</label>
                <TextArea onChange={onDescriptionChange} value={description} />
                <br />
                <br />

                <select onChange={onPrivateChange}>
                    {privateOptions.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <br />
                <br />

                <select onChange={onCategoryChange}>
                    {categoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <br />
                <br />

                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default VideoUploadPage;
