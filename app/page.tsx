"use client"

import styles from "./page.module.css";
import "./global.css";
import { useEffect, useRef } from "react";

function Home() {

  const itemsListElement = useRef<HTMLUListElement>(null);
  const inputField = useRef<HTMLInputElement>(null);
  const toDoItemsKeyName = "to-do-list";
  let items: any[] = [];

  useEffect(() => {
    if (localStorage.getItem(toDoItemsKeyName)) items = JSON.parse("" + localStorage.getItem(toDoItemsKeyName));
    initItems();
  }, []);

  function clearList() {
    let lastChild = itemsListElement.current?.lastChild;
    while (lastChild) {
      itemsListElement.current?.removeChild(lastChild);
      lastChild = itemsListElement.current?.lastChild;
    }
  }

  function appendListItem(index: number, task: string, isDone: boolean) {

    const itemParentBox = document.createElement("div");
    itemParentBox.classList.add(`${styles.itemParentBox}`);
    itemParentBox.id = "item_parent_box_" + index;

    const listItem = document.createElement("li");
    listItem.innerHTML = task;
    listItem.id = "item_text_" + index;
    listItem.classList.add(`${styles.listItem}`);
    if (isDone) listItem.classList.add(`${styles.taskDone}`);
    listItem.onclick = () => {
      putTaskOnDone(listItem, index);
    };

    const taskDeleteButton = document.createElement("span");
    taskDeleteButton.classList.add(`${styles.taskDeleteButton}`);
    taskDeleteButton.innerHTML = "❌";
    taskDeleteButton.id = "item_delete_" + index;
    taskDeleteButton.onclick = () => {
      removeItem(itemParentBox, index);
    };

    itemParentBox.appendChild(listItem);
    itemParentBox.appendChild(taskDeleteButton);

    itemsListElement.current?.appendChild(itemParentBox);
  }

  function initItems() {
    if (items.length > 0) {
      for (let index = 0; index < items.length; index++) {
        const task = items[index]["task"];
        const isDone = items[index]["isDone"];
        appendListItem(index + 1, task, isDone);
      }
    }
    else showEmptyListState();
  }

  function addItem() {
    const itemText = ("" + inputField.current?.value).trim();
    if (itemText !== "") {
      if (items.length == 0) clearList();
      inputField.current!.value = "";
      const itemObject = {
        task: itemText,
        isDone: false
      }
      items[items.length] = itemObject;
      localStorage.setItem(toDoItemsKeyName, JSON.stringify(items));
      appendListItem(items.length, itemText, false);
    }
  }

  function putTaskOnDone(listItem: HTMLElement, index: number) {
    if (listItem.classList.contains(`${styles.taskDone}`)) {
      items[index - 1]["isDone"] = false;
      listItem.classList.remove(`${styles.taskDone}`);
    }
    else {
      items[index - 1]["isDone"] = true;
      listItem.classList.add(`${styles.taskDone}`);
    }
    localStorage.setItem(toDoItemsKeyName, JSON.stringify(items));
  }

  function removeItem(listItemParentBox: HTMLElement, index: number) {
    items.splice(index - 1, 1);
    localStorage.setItem(toDoItemsKeyName, JSON.stringify(items));
    itemsListElement.current?.removeChild(listItemParentBox);
    if (items.length == 0) showEmptyListState();
  }

  function showEmptyListState() {
    const listItem = document.createElement("h1");
    listItem.innerHTML = "Empty To-Do List";
    itemsListElement.current?.appendChild(listItem);
  }

  return (
    <main className={styles.mainContainer}>
      <div className={styles.mainToDoListContainer}>
        <h1 className={styles.header}>My To Do List</h1>
        <ul className={styles.listOfItems} ref={itemsListElement}>
        </ul>
        <input type="text" className={styles.inputField} placeholder="Enter Your To-Do Task" id="itemField" ref={inputField} autoComplete="off"/>
        <button className={styles.submitButton} onClick={addItem}>Add</button>
      </div>
    </main>
  );
}

export default Home;