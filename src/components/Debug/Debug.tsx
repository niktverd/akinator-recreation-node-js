'use client'

import { useState } from "react";

export const Debug = ({object, title}: {title: string, object: object}) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
    <div
        style={{
            border: '1px solid lightgrey',
            padding: '0 20px 20px 20px',
        }}
    >
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <h3>{title}</h3>
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
            >{isCollapsed ? 'expand' : 'collapse'}</button>
        </div>
        {!isCollapsed && (
            <pre>
                {JSON.stringify(object, null, 3)}
            </pre>
        )}
    </div>
    );
}
