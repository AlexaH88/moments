import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

/* create custom hooks */
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
    /* request current user data */
    const [currentUser, setCurrentUser] = useState(null);

    const history = useHistory();

    const handleMount = async () => {
        try {
            /* use axios response (axiosRes) */
            const { data } = await axiosRes.get("dj-rest-auth/user/");
            setCurrentUser(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        handleMount();
    }, []);

    useMemo(() => {
        axiosReq.interceptors.response.use(
            async (config) => {
                /* try refreshing the token */
                try {
                    await axios.post("/dj-rest-auth/token/refresh/");
                    /* if refreshing fails, and user was previously logged in, redirect to sign in */
                } catch (err) {
                    setCurrentUser((prevCurrentUser) => {
                        if (prevCurrentUser) {
                            history.push("/signin");
                        }
                        /* set the user data to null */
                        return null;
                    });
                    return config;
                }
                return config;
            },
            (err) => {
                return Promise.reject(err);
            }
        );

        /* axios response */
        axiosRes.interceptors.response.use(
            /* return the response if there is one */
            (response) => response,
            /* throw an error if there is no response */
            async (err) => {
                /* check for 401 access not authorised error */
                if (err.response?.status === 401) {
                    /* try refreshing the token */
                    try {
                        await axios.post("/dj-rest-auth/token/refresh/");
                    } catch (err) {
                        /* if user was logged in, redirect them to sign in */
                        setCurrentUser((prevCurrentUser) => {
                            if (prevCurrentUser) {
                                history.push("/signin");
                            }
                            /* set the user data to null */
                            return null;
                        });
                    }
                    /* axios(err.config) to exit the interceptor, if no error when refreshing the token */
                    return axios(err.config);
                }
                /* if error wasn't 401, reject error and exit interceptor */
                return Promise.reject(err);
            }
        );
    }, [history]);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};
