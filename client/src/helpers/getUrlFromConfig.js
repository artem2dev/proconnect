export const getUrlFromConfig = (path = '') => {
    return `${process.env.REACT_APP_PUBLIC_URL}${path}`;
};
