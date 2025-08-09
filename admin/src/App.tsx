import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ListProducts from './pages/ListProducts'
import UpdateProducts from './pages/UpdateProducts'
import RemoveProducts from './pages/RemoveProducts'
import { ToastContainer } from 'react-toastify'
import AddProducts from './pages/AddProducts'

const App = () => {
  return (
    <div>
      <ToastContainer></ToastContainer>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path='/list-products' element={<ListProducts/>}></Route>
        <Route path='/update-products' element={<UpdateProducts/>}></Route>
        <Route path='/remove-products' element={<RemoveProducts/>}></Route>
        <Route path='/add-products' element={<AddProducts/>}></Route>
      </Routes>
    </div>
  )
}

export default App
