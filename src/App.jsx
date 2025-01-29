import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi  from './abis/abi.json';


const contractAddress = '0xcff3FB9e8304E5e2163bCb3A56A5Ee8e11999fdb';


const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskTitle, setTaskTitle] = useState('');

  useEffect(() => {
   
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();
        const newContract = new ethers.Contract(contractAddress, contractABI, newSigner);
        setProvider(newProvider);
        setSigner(newSigner);
        setContract(newContract);
        await loadTasks(newContract);
      }
    };
    loadBlockchainData();
  }, []);

  // Charger les tâches
  const loadTasks = async (contract) => {
    try {
      const myTasks = await contract.getMyTask();
      setTasks(myTasks);
    } catch (error) {
      console.error("Erreur lors du chargement des tâches", error);
    }
  };

  // Ajouter une tâche
  const addTask = async () => {
    if (!taskText || !taskTitle) return;
    try {
      const tx = await contract.addTask(taskText, taskTitle, false);
      await tx.wait();
      setTaskText('');
      setTaskTitle('');
      loadTasks(contract); // Recharger les tâches après ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche", error);
    }
  };

  // Supprimer une tâche
  const deleteTask = async (taskId) => {
    try {
      const tx = await contract.deleteTask(taskId);
      await tx.wait();
      loadTasks(contract); // Recharger les tâches après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche", error);
    }
  };

  return (
    <div>
      <h1>TODO list</h1>

      <div>
        <h2>ADD task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button onClick={addTask}>Add task</button>
      </div>

      <h2>My task</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <h3>{task.taskTitle}</h3>
            <p>{task.taskText}</p>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
