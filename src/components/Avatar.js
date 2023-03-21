import React from "react";
import styles from "../styles/Avatar.module.css";

/* destructured version */
const Avatar = ({ src, height = 45, text }) => {
    return (
        <span>
            <img
                className={styles.Avatar}
                src={src}
                height={height}
                /* use height for width also to have the same length all over */
                width={height}
                alt="avatar"
            />
            {text}
        </span>
    );
};

export default Avatar;

/* alternative version */
// const Avatar = (props) => {
//     const { src, height = 45, text } = props;
//     return <div>Avatar</div>;
// };

// export default Avatar;
