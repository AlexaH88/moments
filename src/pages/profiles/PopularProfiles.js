import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";

const PopularProfiles = ({ mobile }) => {
    const { popularProfiles } = useProfileData();

    return (
        /* check for mobile prop being present and only display on small screens */
        <Container
            className={`${appStyles.Content} ${
                mobile && "d-lg-none text-center mb-3"
            }`}
        >
            {popularProfiles.results.length ? (
                <>
                    <p>Most followed profiles</p>
                    {/* display mobile and desktop versions */}
                    {mobile ? (
                        <div className="d-flex justify-content-around">
                            {/* show only first 4 results on mobile */}
                            {popularProfiles.results
                                .slice(0, 4)
                                .map((profile) => (
                                    <Profile
                                        key={profile.id}
                                        profile={profile}
                                        mobile
                                    />
                                ))}
                        </div>
                    ) : (
                        /* map over popular profiles and display para for each */
                        popularProfiles.results.map((profile) => (
                            <Profile key={profile.id} profile={profile} />
                        ))
                    )}
                </>
            ) : (
                <Asset spinner />
            )}
        </Container>
    );
};

export default PopularProfiles;
