import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Loading from './loading';
import GetStarted from './components/login/getStarted';
import RoadMap from './components/roadmap/roadmap';
import Home from './components/profile/home';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
      <Router>
        <Routes>
            <Route path="/" element={<GetStarted />} />
            <Route path="/roadmap" element={<RoadMap />} />
            <Route path="/chats" element={<Home />} />
            {/* Add other routes here */}
        </Routes>
      </Router>
      )}
    </>
  )
};

export default App
