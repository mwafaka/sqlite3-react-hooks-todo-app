import React, { useEffect, useState } from "react";
import axios from "axios";

import { Paper, TextField } from "@material-ui/core";
import { Checkbox, Button } from "@material-ui/core";
import "./App.css";
const apiUrl = "http://localhost:3000/tasks";

function App() {
  const [state, setState] = useState({ tasks: [], description: "" });
  useEffect(() => {
    async function getData() {
      const { data } = await axios.get(apiUrl);
      setState({ tasks: data });
    }
    getData();
  }, []);

  const handleChange = (e) =>
    setState({
      tasks: [...tasks],
      description: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { tasks } = state;
    const description = state.description;
    const { data } = await axios.post(apiUrl, { description });
    tasks.push(data);

    setState({ tasks, description: "" });
  };
  console.log(state);
  const handleUpdate = async (description) => {
    const tasks = [...state.tasks];
    console.log(tasks);
    const index = tasks.findIndex((task) => task.id === description);

    tasks[index].completed = !tasks[index].completed;
    setState({ tasks });
    console.log(description);
    await axios.put(apiUrl + "/" + description, {
      completed: tasks[index].completed,
    });
  };

  const handleDelete = async (currentTask) => {
    const tasks = state.tasks.filter((task) => task.id !== currentTask);
    setState({ tasks });
    await axios.delete(apiUrl + "/" + currentTask);
  };
  const { tasks } = state;

  return (
    <div className="App flex">
      <div elevation={3} className="container">
        <div className="heading">Mern todo app</div>
        <form
          onSubmit={handleSubmit}
          className="flex"
          style={{ margin: "15px 0" }}
        >
          <TextField
            variant="outlined"
            size="small"
            style={{ width: "80%" }}
            value={state.description}
            required={true}
            onChange={handleChange}
            placeholder="Add New TO-DO"
          />
          <button
            style={{ height: "40px" }}
            color="primary"
            variant="outlined"
            type="submit"
          >
            Add task
          </button>
        </form>
        <div>
          {tasks.map((task) => (
            <Paper key={task.id} className="flex task_container">
              <Checkbox
                checked={task.completed===1}
                onClick={() => handleUpdate(task.id)}
                color="primary"
              />
              <div className={task.completed ? "task line_through" : "task"}>
                {task.description}
              </div>
              <Button onClick={() => handleDelete(task.id)} color="secondary">
                delete
              </Button>
            </Paper>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;
