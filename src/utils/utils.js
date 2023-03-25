import { axiosReq } from "../api/axiosDefaults";

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
                    /* if some is true, they match and we're displaying that post already so only return accumulator without adding the post to it */
                    ? acc
                    /* if some does not find a match we return the new results, with added post */
                    : [...acc, cur];
            /* append new results */
            }, prevResource.results),
        }));
    } catch (err) {}
};
