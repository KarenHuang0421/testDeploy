import I18n from "i18n-js";
import zhTW from "./zh-tw";
import en from "./en";

I18n.missingTranslation = (scope) => {
    return scope;
};
I18n.translations = {
    "zh-TW": zhTW,
    "en-US": en,
    "en-GB": en,
    en,
};

export default I18n;
