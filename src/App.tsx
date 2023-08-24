import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Main } from './pages/Main';
import { CreateHistory } from './pages/create-history/CreateHistory';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <div className="App bg-yellow-100 mx-auto h-screen overflow-auto">
      <Router>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/create-history' element={<CreateHistory />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
