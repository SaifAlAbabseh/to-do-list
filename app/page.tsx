'use client'

import { MutableRefObject, useEffect, useRef, useState } from 'react';
import './page.css';

function App() {

  const listArea = useRef() as MutableRefObject<HTMLDivElement>;
  const inputArea = useRef() as MutableRefObject<HTMLTextAreaElement>;;
  const localStorageItemKey = "toDo";
  const [localStorageArray, setLocalStorageArray] = useState<string[]>([]);

  function enterTask() {
    const taskElement = inputArea.current;
    const taskText = taskElement.value.trim();
    const tasksFromLocalStorage = localStorage.getItem(localStorageItemKey);
    if (taskText != "" && tasksFromLocalStorage !== null) {
      const oldArray = JSON.parse(tasksFromLocalStorage);
      const newArray = [...oldArray, taskText];
      localStorage.setItem(localStorageItemKey, JSON.stringify(newArray));
      setLocalStorageArray(newArray);
    }
    taskElement.value = "";
  }

  function removeTask(index: number) {
    const tasksFromLocalStorage = localStorage.getItem(localStorageItemKey);
    if (tasksFromLocalStorage !== null) {
      const array = JSON.parse(tasksFromLocalStorage);
      array.splice(index, 1);
      localStorage.setItem(localStorageItemKey, JSON.stringify(array));
      setLocalStorageArray(array);
    }
  }

  useEffect(() => {
    const tasksFromLocalStorage = localStorage.getItem(localStorageItemKey);
    if (tasksFromLocalStorage !== null) {
      const localStorageArray2 = JSON.parse(tasksFromLocalStorage);
      if (localStorageArray2 === null) localStorage.setItem(localStorageItemKey, JSON.stringify([]));
      else setLocalStorageArray(localStorageArray2);
    }
  }, []);

  return (
    <div className="mainContainer">
      <div className="toDoListArea" ref={listArea}>
        {
          localStorageArray.map((item: string, index: number) => {
            return (
              <div className={`toDoListAreaRow toDoListAreaRow${index % 2 != 0 ? "Odd" : "Even"}`} key={index}>
                <h2 className="toDoTaskLabel">
                  {item}
                </h2>
                <button className="removeButton" onClick={() => removeTask(index)}> X </button>
              </div>
            )
          })
        }
      </div>
      <div className="inputArea">
        <textarea className="inputField" placeholder="Type Your To-Do Task Here.." ref={inputArea} />
        <button className="submitButton" onClick={enterTask}> Submit </button>
      </div>
    </div>
  );
}

export default App;
