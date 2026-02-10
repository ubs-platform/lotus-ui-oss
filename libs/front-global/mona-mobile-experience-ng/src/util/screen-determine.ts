import { ReplaySubject, Subject } from "rxjs";

const _screenTypeStatus = new ReplaySubject<"mobile" | "tablet" | "desktop">(1);


const mobile = {
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,

    updateScreenType: () => {
        mobile.isMobile = window.innerWidth < 768;
        mobile.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        mobile.isDesktop = window.innerWidth >= 1024;
    },
};

const updateScreenDetails = () => {
    mobile.updateScreenType();
    _screenTypeStatus.next(
        mobile.isMobile ? "mobile" : mobile.isTablet ? "tablet" : "desktop"
    );
}
window.addEventListener("resize", () => {
    updateScreenDetails();
});
updateScreenDetails();

export const screenTypeStatus = _screenTypeStatus.asObservable();
