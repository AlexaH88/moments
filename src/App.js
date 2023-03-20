/* create an object 'styles' with all the css from the file */
import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { Route, Switch } from 'react-router-dom';

function App() {
    return (
        /* styles is the imported object above, and .App is the class in the css file */
        <div className={styles.App}>
            <NavBar />
            <Container className={styles.Main}>
                <Switch>
                    <Route exact path="/" render={() => <h1>Home page</h1>} />
                    <Route exact path="/signin" render={() => <h1>Sign in</h1>} />
                    <Route exact path="/signup" render={() => <h1>Sign up</h1>} />
                    {/* Page not found error message if incorrect url entered*/}
                    <Route render={() => <p>Page not found!</p>} />
                </Switch>
            </Container>
        </div>
    );
}

export default App;