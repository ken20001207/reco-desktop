/** Firebase API URL */
export const apiURL = "https://reco-backend.linyuanlin.com";
// export const apiURL = "http://localhost:8080/";

/** 動畫參數 */
export const duration = 800;
export const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
};
export const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
    unmounted: { opacity: 0 },
};
