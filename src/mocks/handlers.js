import { rest } from "msw";

const baseURL = "https://drf-api-alexa.herokuapp.com/";

export const handlers = [
    rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
        return res(
            ctx.json({
                pk: 5,
                username: "lex",
                email: "",
                first_name: "",
                last_name: "",
            })
        );
    }),
    rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
];
