"use client"

import styles from "./page.module.css";
import "./global.css";
import { useEffect, useRef } from "react";

function Home() {

  const itemsListElement = useRef<HTMLUListElement>(null);
  const inputField = useRef<HTMLInputElement>(null);
  const toDoItemsKeyName = "to-do-list";
  type ItemObject = {
    task: string;
    isDone: boolean;
  };
  let items: Map<string, ItemObject> = new Map();

  useEffect(() => {
    const storageItems = localStorage.getItem(toDoItemsKeyName);
    if (storageItems) {
      let parsedArray = JSON.parse(storageItems);
      items = new Map<string, ItemObject>(parsedArray);
    }
    initItems();
  }, []);

  function clearList() {
    let lastChild = itemsListElement.current?.lastChild;
    while (lastChild) {
      itemsListElement.current?.removeChild(lastChild);
      lastChild = itemsListElement.current?.lastChild;
    }
  }

  function appendListItem(id: string, task: string, isDone: boolean) {

    const itemParentBox = document.createElement("div");
    itemParentBox.classList.add(`${styles.itemParentBox}`);
    itemParentBox.id = "item_parent_box_" + id;

    const listItem = document.createElement("li");
    listItem.innerHTML = task;
    listItem.id = "item_text_" + id;
    listItem.classList.add(`${styles.listItem}`);
    if (isDone) listItem.classList.add(`${styles.taskDone}`);
    listItem.onclick = () => {
      putTaskOnDone(listItem, id);
    };

    const taskDeleteButton = document.createElement("span");
    taskDeleteButton.classList.add(`${styles.taskDeleteButton}`);
    taskDeleteButton.innerHTML = "❌";
    taskDeleteButton.id = "item_delete_" + id;
    taskDeleteButton.onclick = () => {
      removeItem(itemParentBox, id);
    };

    itemParentBox.appendChild(listItem);
    itemParentBox.appendChild(taskDeleteButton);

    itemsListElement.current?.appendChild(itemParentBox);
  }

  function initItems() {
    if (items.size > 0) {
      items.forEach((value, key) => {
        console.log(value);
        const task = value.task;
        const isDone = value.isDone;
        appendListItem(key, task, isDone);
      })
    }
    else showEmptyListState();
  }

  function addItem() {
    const itemText = ("" + inputField.current?.value).trim();
    if (itemText !== "") {
      if (items.size == 0) clearList();
      inputField.current!.value = "";
      const itemObject = {
        task: itemText,
        isDone: false
      }
      let itemId = "item_" + (items.size + 1);
      items.set(itemId, itemObject);
      localStorage.setItem(toDoItemsKeyName, JSON.stringify(Array.from(items.entries())));
      appendListItem(itemId, itemText, false);
    }
  }

  function putTaskOnDone(listItem: HTMLElement, id: string) {
    const item = items.get(id);
    if (listItem.classList.contains(`${styles.taskDone}`)) {
      if(item) item.isDone = false;
      listItem.classList.remove(`${styles.taskDone}`);
    }
    else {
      if(item) item.isDone = true;
      listItem.classList.add(`${styles.taskDone}`);
    }
    localStorage.setItem(toDoItemsKeyName, JSON.stringify(Array.from(items.entries())));
  }

  function removeItem(listItemParentBox: HTMLElement, id: string) {
    items.delete(id);
    localStorage.setItem(toDoItemsKeyName, JSON.stringify(Array.from(items.entries())));
    itemsListElement.current?.removeChild(listItemParentBox);
    if (items.size == 0) showEmptyListState();
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
        <input type="text" className={styles.inputField} placeholder="Enter Your To-Do Task" id="itemField" ref={inputField} autoComplete="off" />
        <button className={styles.submitButton} onClick={addItem}>Add</button>
      </div>
    </main>
  );
}

export default Home;