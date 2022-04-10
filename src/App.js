import React, { useState, useEffect } from 'react';
import './App.css';
import Table from './Table/Table';
import Table1 from './Table/Table1';



function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <div className='App'>
      <Table1/>
    </div>
  );
}

export default App;
