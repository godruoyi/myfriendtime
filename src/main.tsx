import React from 'react'
import ReactDOM from 'react-dom/client'
import MyFriends from "./pages/MyFriends.tsx";
import AnimatedSizeWrapper from "./compontents/AnimatedSizeWrapper.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AnimatedSizeWrapper>
            <MyFriends/>
        </AnimatedSizeWrapper>
    </React.StrictMode>,
)
