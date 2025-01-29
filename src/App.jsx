import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from './abis/abi.json';



const App = () => {
  const contractAddress = '0xcff3FB9e8304E5e2163bCb3A56A5Ee8e11999fdb';
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskTitle, setTaskTitle] = useState('');


  const connectToBlockchain = async () => {
    if (window.ethereum) {
      try {

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await provider.getSigner();
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
        const newContract = new ethers.Contract(contractAddress, abi, signer);
        console.log("contract:", newContract);
        setProvider(newProvider);
        setSigner(newSigner);
        setContract(newContract);
        
        console.log("connected to blockchain");
      } catch (error) {
        console.error("errot:", error);
      }
    } else {
      console.log("install metamask");
    }
  };


  const loadTasks = async () => {
    if (contract) {
      try {
        const myTasks = await contract.getMyTask();
        setTasks(myTasks);
      } catch (error) {
        console.error("error while loading taskd:", error);
      }
    }
  };


  const addTask = async () => {
    if (!taskText || !taskTitle) return;

    if (contract) {
      try {
        const tx = await contract.addTask(taskText, taskTitle, false);
        await tx.wait();
        setTaskText('');
        setTaskTitle('');
        loadTasks();
      } catch (error) {
        console.error("error while adding", error);
      }
    }
  };


  const deleteTask = async (taskId) => {
    if (contract) {
      try {
        const tx = await contract.deleteTask(taskId);
        await tx.wait();
        loadTasks();
      } catch (error) {
        console.error("error while deletiing", error);
      }
    }
  };

  return (
    <div>
      <h1>ToDO list</h1>
      <button onClick={connectToBlockchain}>Connect to metamask</button>

      <div>
        <h2>Add task</h2>
        <input
          type="text"
          placeholder="title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button onClick={addTask}>Add task</button>
      </div>

      <h2>My tasks</h2>
      <button onClick={loadTasks}>load my tasks</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.taskTitle}</h3>
            <p>{task.taskText}</p>
            <button onClick={() => deleteTask(task.id)}>delete Task</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
