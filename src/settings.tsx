import React from 'react';
import ReactDOM from 'react-dom/client';
import Settings from './pages/Settings.tsx';
import AnimatedSizeWrapper from './compontents/AnimatedSizeWrapper.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AnimatedSizeWrapper>
            <Settings />
        </AnimatedSizeWrapper>
    </React.StrictMode>
);
