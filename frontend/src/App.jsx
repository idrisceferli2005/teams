import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './App.css'
import Layout from './components/layout/Layout'
import Teams from './pages/Teams'
import Player from './pages/Player'
import Matches from './pages/Matches'
import "antd/dist/reset.css"; 
import Login from './pages/auth/login/Login'
function App() {

const router = createBrowserRouter([
{
path: '/',
element: <Layout/>,
children: [
{
index: true,
element: <Teams/>
},
{
path: "players",
element: <Player/>
},
{
path: "matches",
element: <Matches/>
},
{
  path: "login",
  element: <Login/>
}

]

}
])
  return (
    <>
     
  <RouterProvider router={router} />
    </>
  )
}

export default App
