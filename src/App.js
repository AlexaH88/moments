/* create an object 'styles' with all the css from the file */
import styles from './App.module.css';
import NavBar from './components/NavBar';

function App() {
    return (
        /* styles is the imported object above, and .App is the class in the css file */
        <div className={styles.App}>
            <NavBar />
        </div>
    );
}

export default App;