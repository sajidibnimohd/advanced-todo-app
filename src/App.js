import React, { useState, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";



import axios from "axios";
import "./App.css";

// Redux Actions
const ADD_TASK = "ADD_TASK";
const REMOVE_TASK = "REMOVE_TASK";
const SET_WEATHER = "SET_WEATHER";
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

const addTask = (task) => ({ type: ADD_TASK, payload: task });
const removeTask = (id) => ({ type: REMOVE_TASK, payload: id });
const setWeather = (weather) => ({ type: SET_WEATHER, payload: weather });
const login = () => ({ type: LOGIN });
const logout = () => ({ type: LOGOUT });

// Redux Reducer
const initialState = { tasks: [], weather: null, isAuthenticated: false };
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case REMOVE_TASK:
      return { ...state, tasks: state.tasks.filter((_, i) => i !== action.payload) };
    case SET_WEATHER:
      return { ...state, weather: action.payload };
    case LOGIN:
      return { ...state, isAuthenticated: true };
    case LOGOUT:
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunk));




// Fetch Weather Data
const fetchWeather = () => async (dispatch) => {
  try {
    const response = await axios.get("https://api.weatherapi.com/v1/current.json?key=521c691972ba4f11bff91531252503&q=London");

    dispatch(setWeather(response.data.current.temp_c + "°C"));
    dispatch(setWeather(response.data.current.temp_c + "°C"));
  } catch (error) {
    dispatch(setWeather("Error fetching weather"));
  }
};

// Components
const TaskInput = () => {
  const [task, setTask] = useState("");
  const dispatch = useDispatch();
  
  const addNewTask = () => {
    if (task.trim()) {
      dispatch(addTask({ text: task, priority: "Medium" }));
      setTask("");
    }
  };

  return (
    <div>
      <input type="text" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Add a new task" />
      <button onClick={addNewTask}>Add</button>
    </div>
  );
};

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  return (
    <ul>
      {tasks.map((task, index) => (
        <li key={index}>
          {task.text} ({task.priority})
          <button onClick={() => dispatch(removeTask(index))}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

const Weather = () => {
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weather);
  
  useEffect(() => {
    dispatch(fetchWeather());
  }, [dispatch]);
  
  return weather ? <p>Weather: {weather}</p> : <p>Loading weather...</p>;
};

const Auth = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const dispatch = useDispatch();

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={() => dispatch(logout())}>Logout</button>
      ) : (
        <button onClick={() => dispatch(login())}>Login</button>
      )}
    </div>
  );
};

const App = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);

  return (
    <div>
      <h1>Advanced To-Do App</h1>
      <Auth />
      {isAuthenticated ? (
        <>
          <Weather />
          <TaskInput />
          <TaskList />
        </>
      ) : (
        <p>Please log in to manage tasks.</p>
      )}
    </div>
  );
};

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;
