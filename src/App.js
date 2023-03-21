/* create an object 'styles' with all the css from the file */
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

function App() {
    /* request current user data */
    const [currentUser, setCurrentUser] = useState(null);

    const handleMount = async () => {
        try {
            const { data } = await axios.get("dj-rest-auth/user/");
            setCurrentUser(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        handleMount();
    }, []);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                /* styles is the imported object above, and .App is the class in
                the css file */
                <div className={styles.App}>
                    <NavBar />
                    <Container className={styles.Main}>
                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={() => <h1>Home page</h1>}
                            />
                            <Route
                                exact
                                path="/signin"
                                render={() => <SignInForm />}
                            />
                            <Route
                                exact
                                path="/signup"
                                render={() => <SignUpForm />}
                            />
                            {/* Page not found error message if incorrect url entered*/}
                            <Route render={() => <p>Page not found!</p>} />
                        </Switch>
                    </Container>
                </div>
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
}

export default App;
