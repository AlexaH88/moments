import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function PostPage() {
    /* fetch post by id */
    const { id } = useParams();
    /* put results in an array as this is the same format that will be returned if there are multiple results */
    const [post, setPost] = useState({ results: [] });

    useEffect(() => {
        const handleMount = async () => {
            /* make request to API */
            try {
                /* assign data to variable and rename it post */
                /* Promise.all gets an array of results */
                const [{ data: post }] = await Promise.all([
                    axiosReq.get(`posts/${id}`),
                ]);
                /* set post results with returned post data */
                setPost({ results: [post] });
                console.log(post);
            } catch (err) {
                console.log(err);
            }
        };

        /* run handleMount every time the post id changes */
        handleMount();
    }, [id]);

    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <p>Popular profiles for mobile</p>
                <p>Post component</p>
                <Container className={appStyles.Content}>Comments</Container>
            </Col>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                Popular profiles for desktop
            </Col>
        </Row>
    );
}

export default PostPage;
