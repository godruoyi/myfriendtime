import React from 'react'
import ReactDOM from 'react-dom/client'
import AnimatedSizeWrapper from "./compontents/AnimatedSizeWrapper.tsx";
import NewFriend from './pages/NewFriend.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AnimatedSizeWrapper>
            <NewFriend />
        </AnimatedSizeWrapper>
    </React.StrictMode>,
)
