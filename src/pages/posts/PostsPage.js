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
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

/* add message and filter props, filter as an empty string initially */
function PostsPage({ message, filter = "" }) {
    const [posts, setPosts] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    /* used to determine what url the user is on */
    const { pathname } = useLocation();

    const [query, setQuery] = useState("");

    /* fetch data from API */
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                /* get filtered posts and searched queries */
                const { data } = await axiosReq.get(
                    `/posts/?${filter}search=${query}`
                );
                setPosts(data);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };

        /* setHasLoaded to false so that the loading spinner displays */
        setHasLoaded(false);
        /* use timer of 1s to delay calling the fetch posts function for better UI */
        const timer = setTimeout(() => {
            /* call fetchPosts when filter, pathname or query changes */
            fetchPosts();
        }, 1000);
        /* clear timer within cleanup function */
        return () => {
            clearTimeout(timer);
        };
    }, [filter, query, pathname]);

    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                {/* mobile prop included to be shown only on small screens */}
                <PopularProfiles mobile />
                {/* search bar */}
                <i className={`fas fa-search ${styles.SearchIcon}`} />
                <Form
                    className={styles.SearchBar}
                    /* stop default page refresh if user hits enter */
                    onSubmit={(event) => event.preventDefault()}
                >
                    <Form.Control
                        type="text"
                        className="mr-sm-2"
                        placeholder="Search posts"
                        value={query}
                        /* update query when event target value changes */
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </Form>
                {/* check if data has been loaded, and show loading spinner if not */}
                {hasLoaded ? (
                    /* show posts or display a message */
                    <>
                        {/* check if there are any posts */}
                        {posts.results.length ? (
                            /* infinite scroll component */
                            <InfiniteScroll
                                /* children prop determines the data to display */
                                children={
                                    /* map over posts and return Post component for each */
                                    posts.results.map((post) => (
                                        /* give it a key, spread the post object and include setPosts so that users can like and unlike */
                                        <Post
                                            key={post.id}
                                            {...post}
                                            setPosts={setPosts}
                                        />
                                    ))
                                }
                                /* dataLength determines how much data there is */
                                dataLength={posts.results.length}
                                /* loader icon */
                                loader={<Asset spinner />}
                                /* hasMore determines whether there is more to load on reaching end of page */
                                hasMore={!!posts.next}
                                /* next prop runs if hasMore equals true */
                                next={() => fetchMoreData(posts, setPosts)}
                            />
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
                <PopularProfiles />
            </Col>
        </Row>
    );
}

export default PostsPage;
