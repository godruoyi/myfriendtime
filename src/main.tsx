import React from 'react'
import ReactDOM from 'react-dom/client'
import MyFriends from "./pages/MyFriends.tsx";

import './main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MyFriends/>
    </React.StrictMode>,
)
