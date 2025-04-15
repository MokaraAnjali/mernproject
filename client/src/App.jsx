import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/dashboards';
import AddProduct from './components/AddProducts';
import EditProduct from './components/EditProducts'; // Import Edit page

function App() {
  return (
    <BrowserRouter>
      <div className='flex flex-col items-center mt-4 mx-auto'>
        <main className='min-h-160 bg-gray-100 w-full flex flex-col items-center'>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/editProduct/:id" element={<EditProduct />} /> {/* Edit route with dynamic id */}

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
