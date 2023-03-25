import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import NoResults from "../../assets/no-results.png";
import Asset from "../../components/Asset";

/* add message and filter props, filter as an empty string initially */
function PostsPage({ message, filter = "" }) {
    const [posts, setPosts] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    /* used to determine what url the user is on */
    const { pathname } = useLocation();

    /* fetch data from API */
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axiosReq.get(`/posts/?${filter}`);
                setPosts(data);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };

        /* setHasLoaded to false so that the loading spinner displays */
        setHasLoaded(false);
        /* call fetchPosts when filter or pathname changes */
        fetchPosts();
    }, [filter, pathname]);

    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <p>Popular profiles mobile</p>
                {/* check if data has been loaded, and show loading spinner if not */}
                {hasLoaded ? (
                    /* show posts or display a message */
                    <>
                        {/* check if there are any posts */}
                        {posts.results.length ? (
                            /* map over posts and return Post component for each */
                            posts.results.map((post) => (
                                /* give it a key, spread the post object and include setPosts so that users can like and unlike */
                                <Post
                                    key={post.id}
                                    {...post}
                                    setPosts={setPosts}
                                />
                            ))
                        ) : (
                            <Container className={appStyles.Content}>
                                <Asset src={NoResults} message={message} />
                            </Container>
                        )}
                    </>
                ) : (
                    <Container className={appStyles.Content}>
                        <Asset spinner />
                    </Container>
                )}
            </Col>
            <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
                <p>Popular profiles for desktop</p>
            </Col>
        </Row>
    );
}

export default PostsPage;
