import { axiosReq } from "../api/axiosDefaults";
import jwtDecode from "jwt-decode";

/* to be used with infinite scroll */
export const fetchMoreData = async (resource, setResource) => {
    try {
        /* get next page of results */
        const { data } = await axiosReq.get(resource.next);
        setResource((prevResource) => ({
            ...prevResource,
            /* link to the next page of results we just fetched */
            next: data.next,
            /* update new results. Reduce looks through results from API */
            results: data.results.reduce((acc, cur) => {
                /* use some() to look through results in accumulator */
                /* compare current id to newly fetched acc results id */
                return acc.some((accResult) => accResult.id === cur.id)
                    ? /* if some is true, they match and we're displaying that post already so only return accumulator without adding the post to it */
                      acc
                    : /* if some does not find a match we return the new results, with added post */
                      [...acc, cur];
                /* append new results */
            }, prevResource.results),
        }));
    } catch (err) {}
};

export const followHelper = (profile, clickedProfile, following_id) => {
    return profile.id === clickedProfile.id
        ? {
              ...profile,
              followers_count: profile.followers_count + 1,
              following_id,
          }
        : profile.is_owner
        ? {
              ...profile,
              following_count: profile.following_count + 1,
          }
        : profile;
};

export const unfollowHelper = (profile, clickedProfile) => {
    return profile.id === clickedProfile.id
        ? {
              ...profile,
              followers_count: profile.followers_count - 1,
              following_id: null,
          }
        : profile.is_owner
        ? {
              ...profile,
              following_count: profile.following_count - 1,
          }
        : profile;
};

export const setTokenTimestamp = (data) => {
    const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
    localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

export const shouldRefreshToken = () => {
    return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTokenTimestamp = () => {
    localStorage.removeItem("refreshTokenTimestamp");
};
