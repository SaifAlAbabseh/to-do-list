'use client'

import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './page.css';

function App() {

  class Task {

    title: string;
    description: string;
    isCompleted: boolean;

    constructor(title: string, description: string, isCompleted: boolean) {
      this.title = title;
      this.description = description;
      this.isCompleted = isCompleted;
    }
  }

  let ifEdit = [false, -1, null, null];
  const [isCreateOrLoad, setIsCreateOrLoad] = useState(false);
  const listArea = useRef() as MutableRefObject<HTMLDivElement>;
  const inputArea = useRef() as MutableRefObject<HTMLTextAreaElement>;
  const titleField = useRef() as MutableRefObject<HTMLInputElement>;
  const localStorageItemKey = "toDo";
  const [localStorageArray, setLocalStorageArray] = useState<Task[]>([]);


  function enterTask() {
    const taskElement = inputArea.current;
    const taskTitleElement = titleField.current;
    const taskText = taskElement.value.trim();
    const taskTitle = taskTitleElement.value.trim();
    if (ifEdit[0]) {
      if (taskText !== "" && taskTitle !== "") {
        const tasksFromLocalStorage = localStorage.getItem(localStorageItemKey);
        const array = tasksFromLocalStorage ? JSON.parse(tasksFromLocalStorage) : null;
        array[Number(ifEdit[1])].title = taskTitle;
        array[Number(ifEdit[1])].description = taskText;
        localStorage.setItem(localStorageItemKey, JSON.stringify(array));
        setLocalStorageArray(array);
      }
    }
    else {
      const tasksFromLocalStorage = localStorage.getItem(localStorageItemKey);
      if (taskText !== "" && taskTitle !== "" && tasksFromLocalStorage !== null) {
        const newTask = new Task(taskTitle, taskText, false);
        const oldArray = JSON.parse(tasksFromLocalStorage);
        const newArray = [...oldArray, newTask];
        localStorage.setItem(localStorageItemKey, JSON.stringify(newArray));
        setIsCreateOrLoad(true);
        setLocalStorageArray(newArray);
      }
    }
    clearFields(taskTitleElement, taskElement);
    ifEdit = [false, -1, null, null];
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

  function editTask(index: number) {
    const taskElement = inputArea.current;
    const taskTitleElement = titleField.current;
    const tasksFromLocalStorage = localStorage.getItem(localStorageItemKey);
    const array = tasksFromLocalStorage ? JSON.parse(tasksFromLocalStorage) : null;
    taskElement.value = array[index].description;
    taskTitleElement.value = array[index].title;
    ifEdit[0] = true;
    ifEdit[1] = index;
    ifEdit[2] = array[index].title;
    ifEdit[3] = array[index].description;
  }

  function editCompletionStatus(checkbox: EventTarget, index: number) {
    const isItCompleted = (checkbox as HTMLInputElement).checked;
    const tasksFromLocalStorage = localStorage.getItem(localStorageItemKey);
    const array = tasksFromLocalStorage ? JSON.parse(tasksFromLocalStorage) : null;
    array[index].isCompleted = isItCompleted;
    localStorage.setItem(localStorageItemKey, JSON.stringify(array));
    setLocalStorageArray(array);
  }

  function clearFields(taskTitleField: HTMLInputElement, taskDescriptionField: HTMLTextAreaElement) {
    taskTitleField.value = "";
    taskDescriptionField.value = "";
  }

  useEffect(() => {
    setIsCreateOrLoad(true);
    const tasksFromLocalStorage = localStorage.getItem(localStorageItemKey);
    if (tasksFromLocalStorage !== null) {
      const localStorageArray2 = JSON.parse(tasksFromLocalStorage);
      if (localStorageArray2 === null) localStorage.setItem(localStorageItemKey, JSON.stringify([]));
      else setLocalStorageArray(localStorageArray2);
    }
  }, []);

  useLayoutEffect(() => {
    if (isCreateOrLoad) listArea.current.scrollTop = listArea.current.scrollHeight;
    setIsCreateOrLoad(false);
  }, [isCreateOrLoad]);

  return (
    <div className="mainContainer">
      <div className="toDoListArea" ref={listArea}>
        {
          localStorageArray.map((item: Task, index: number) => {
            return (
              <div className={`toDoListAreaRow toDoListAreaRow${index % 2 != 0 ? "Odd" : "Even"}`} key={index}>
                <div className="taskContentParent">
                  <div className="checkboxParent">
                    <span className="customizedCheckBox">{item.isCompleted ? "✓" : ""}</span>
                    <input type="checkbox" className="checkbox" title="Is It Completed?" checked={item.isCompleted} onChange={(e) => editCompletionStatus(e.target, index)} />
                  </div>
                  <div className="taskContentBox">
                    <h2 className="toDoTaskLabel">
                      {item.title}
                    </h2>
                    <h2 className="toDoTaskLabel">
                      <span className="rightArrow">↓</span> <br /> {item.description}
                    </h2>
                  </div>
                </div>
                <div>
                  <button title="Edit Task" className="editButton" onClick={() => editTask(index)}>✎</button>
                  <button title="Remove Task" className="removeButton" onClick={() => removeTask(index)}> X </button>
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="inputAreaParentUpper">
        <div className="inputAreaParent">
          <input type="text" className="inputField titleInputField" placeholder="Type Your To-Do Title Here.." ref={titleField} />
          <textarea className="inputField" placeholder="Type Your To-Do Task Here.." ref={inputArea} />
        </div>
        <div className="submitButtonsBox">
          <button className="submitButton" onClick={enterTask}> Submit </button>
          <button className='submitButton' onClick={() => clearFields(titleField.current, inputArea.current)}>Clear</button>
        </div>
      </div>
    </div>
  );
}

export default App;
