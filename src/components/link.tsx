import React from 'react';
import IconButton from '@material-ui/core/IconButton';

interface IconButtonLink {
    url?: string
    iconComponent: React.ComponentType
}

export const IconButtonLink = ({
    url = "#",
    iconComponent: IconComponent
}: IconButtonLink) => {
    return (
        <IconButton
            disabled={url == "#"}
            href={url}
            target="_blank" rel="noopener noreferrer"
        >
            <IconComponent />
        </IconButton>
    )
}
