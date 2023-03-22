import React, { useState, useEffect, useRef } from "react";

export const useClickOutsideToggle = () => {
    /* handle burger menu expanding and collapsing properly */
    const [expanded, setExpanded] = useState(false);
    const ref = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setExpanded(false)
            }
        }
        /* burger menu collapses when clicking anywhere, not just on burger bars */
        document.addEventListener('mouseup', handleClickOutside)
        return () => {
            document.removeEventListener('mouseup', handleClickOutside)
        }
    }, [ref])

    /* return an object with all the elements the hook needs */
    return { expanded, setExpanded, ref };
};
