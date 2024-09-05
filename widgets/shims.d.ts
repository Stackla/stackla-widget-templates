declare module "*.scss";
declare module "*.css";

interface Window {
    scrollLocked: boolean;
    refreshMasonryLayout: Timeout;
    __isLoading: boolean;
}