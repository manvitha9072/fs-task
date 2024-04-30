import React, { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Counter context
const CounterContext = React.createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, count: action.count, myCount: action.myCount };
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'INCREMENT_MYCOUNT':
      return { ...state, myCount: state.myCount + 1 };
    case 'DECREMENT_MYCOUNT':
      return { ...state, myCount: state.myCount - 1 };
    default:
      return state;
  }
};

const Home = () => {
  const { state } = useContext(CounterContext);

  return (
    <div>
      <h1>Counter Value: {state.count}</h1>
      <h1>My Counter Value: {state.myCount || 0}</h1>
      <Link to="/counter">Counter</Link>
      <br />
      <Link to="/mycounter">My Counter</Link>
    </div>
  );
};

const Counter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/counter');
        dispatch({ type: 'SET', count: response.data.count, myCount: response.data.myCount });
      } catch (err) {
        console.error(err);
      }
    };

    fetchCounter();
  }, [dispatch]);

  const incrementCounter = async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/increment');
      dispatch({ type: 'INCREMENT' });
    } catch (err) {
      console.error(err);
    }
  };

  const decrementCounter = async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/decrement');
      dispatch({ type: 'DECREMENT' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      <p>My Count: {state.myCount}</p>
      <button onClick={incrementCounter}>Increment Count</button>
      <button onClick={decrementCounter}>Decrement Count</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const MyCounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/counter');
        dispatch({ type: 'SET', count: response.data.count, myCount: response.data.myCount });
      } catch (err) {
        console.error(err);
      }
    };

    fetchCounters();
  }, [dispatch]);

  const incrementMyCount = async () => {
    try {
      await axios.post('http://localhost:5000/api/mycounter/increment');
      dispatch({ type: 'INCREMENT_MYCOUNT' });
    } catch (err) {
      console.error(err);
    }
  };

  const decrementMyCount = async () => {
    try {
      await axios.post('http://localhost:5000/api/mycounter/decrement');
      dispatch({ type: 'DECREMENT_MYCOUNT' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>My Counter</h2>
      <p>Count: {state.count}</p>
      <p>MyCount: {state.myCount}</p>
      <button onClick={incrementMyCount}>Increment MyCount</button>
      <button onClick={decrementMyCount}>Decrement MyCount</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, myCount: 0 });

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/mycounter">My Counter</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mycounter" element={<MyCounter />} />
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;