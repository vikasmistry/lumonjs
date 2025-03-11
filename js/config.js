// config.js (or config.mjs)
const config = {
    LIFEUP_HOST: "192.168.1.100", // "localhost",
    LIFEUP_PORT:  "13276",
};

config.BASE_URL = `http://${config.LIFEUP_HOST}:${config.LIFEUP_PORT}/api/contentprovider?url=`;

export default config;
