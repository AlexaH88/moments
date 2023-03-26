import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { Alert, Image } from "react-bootstrap";
import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function PostEditForm() {
    const [postData, setPostData] = useState({
        title: "",
        content: "",
        image: "",
    });
    const { title, content, image } = postData;

    const [errors, setErrors] = useState({});

    const imageInput = useRef(null);
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/posts/${id}/`);
                const { title, content, image, is_owner } = data;

                /* check if post owner is logged in, and only then allow them access to editing the post, or send them back to homepage */
                is_owner
                    ? setPostData({ title, content, image })
                    : history.push("/");
            } catch (err) {
                console.log(err);
            }
        };

        handleMount();
    }, [history, id]);

    const handleChange = (event) => {
        setPostData({
            ...postData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeImage = (event) => {
        /* check if user has selected a file to upload by checking if there is a file in the files array */
        if (event.target.files.length) {
            /* clear browser's reference to previous file, in case user changes the image */
            URL.revokeObjectURL(image);
            setPostData({
                ...postData,
                /* set the image's value by passing it the file in the files array */
                image: URL.createObjectURL(event.target.files[0]),
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("title", title);
        formData.append("content", content);
        /* check if new image has been uploaded */
        if (imageInput?.current?.files[0]) {
            /* keep remaining image if no new one has been added */
            formData.append("image", imageInput.current.files[0]);
        }

        try {
            /* update existing post */
            await axiosReq.put(`/posts/${id}/`, formData);
            /* redirect user to post they just edited */
            history.push(`/posts/${id}`);
        } catch (err) {
            console.log(err);
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };

    const textFields = (
        <div className="text-center">
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.title?.map((message, idx) => {
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>;
            })}

            <Form.Group controlId="content">
                <Form.Label>Content</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={6}
                    name="content"
                    value={content}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.content?.map((message, idx) => {
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>;
            })}

            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => history.goBack()}
            >
                cancel
            </Button>
            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                type="submit"
            >
                save
            </Button>
        </div>
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                    <Container
                        className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                    >
                        <Form.Group className="text-center">
                            <figure>
                                <Image
                                    className={appStyles.Image}
                                    src={image}
                                    rounded
                                />
                            </figure>
                            <div>
                                <Form.Label
                                    className={`${btnStyles.Button} ${btnStyles.Blue}`}
                                    htmlFor="image-upload"
                                >
                                    Change the image
                                </Form.Label>
                            </div>

                            <Form.File
                                id="image-upload"
                                accept="image/*"
                                onChange={handleChangeImage}
                                ref={imageInput}
                            />
                        </Form.Group>
                        {errors?.image?.map((message, idx) => {
                            <Alert variant="warning" key={idx}>
                                {message}
                            </Alert>;
                        })}
                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col>
                <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
                    <Container className={appStyles.Content}>
                        {textFields}
                    </Container>
                </Col>
            </Row>
        </Form>
    );
}

export default PostEditForm;
