import React, {memo} from "react";
import {
    Archive02Icon,
    AttachmentCircleIcon,
    Facebook01Icon,
    TelegramIcon,
    VkSquareIcon,
    WikipediaIcon
} from "hugeicons-react";

import {PersonContactType} from "@/types";

const icons = {
    'wikipedia': <WikipediaIcon/>,
    'facebook': <Facebook01Icon/>,
    'telegram': <TelegramIcon/>,
    'vk': <VkSquareIcon/>,
    'archive': <Archive02Icon/>,
}

const DefaultIcon = <AttachmentCircleIcon/>


export default memo(function FamilyPersonContactIcon({type, size}: {type: PersonContactType, size: number}) {
    const icon = icons[type] ? (icons[type]) : DefaultIcon

    return React.cloneElement(
        icon,
        { size }
    );
});
