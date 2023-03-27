import { useContext, createContext, useState, useEffect } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useCurrentUser } from "./CurrentUserContext";

/* context objects */
export const ProfileDataContext = createContext();
export const setProfileDataContext = createContext();

/* custom hooks */
export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(setProfileDataContext);

/* function */
export const ProfileDataProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        // we will use the pageProfile later!
        pageProfile: { results: [] },
        popularProfiles: { results: [] },
    });

    const currentUser = useCurrentUser();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(
                    // order profiles by most followed
                    "/profiles/?ordering=-followers_count"
                );
                setProfileData((prevState) => ({
                    ...prevState,
                    popularProfiles: data,
                }));
            } catch (err) {
                console.log(err);
            }
        };

        handleMount();
    }, [currentUser]);

    return (
        <ProfileDataContext.Provider value={profileData}>
            <setProfileDataContext.Provider value={setProfileData}>
                {children}
            </setProfileDataContext.Provider>
        </ProfileDataContext.Provider>
    );
};
