import { Task } from "./Task.js";

class Todos {
  #tasks = [];
  #backend_url = "";

  constructor(backend_url) {
    this.#backend_url = backend_url;
  }

  getTasks = () => {
    return new Promise(async (resolve, reject) => {
      fetch(this.#backend_url)
        .then((response) => response.json())
        .then(
          (json) => {
            this.#readJson(json);
            resolve(this.#tasks);
          },
          (error) => {
            reject(error);
          }
        );
    });
  };

  #readJson = (tasksAsJson) => {
    tasksAsJson.forEach((node) => {
      const task = new Task(node.id, node.description);
      this.#tasks.push(task);
    });
  };

  #addToArray = (id, text) => {
    const task = new Task(id, text);
    this.#tasks.push(task);
    return task;
  };

  #removeFromArray = (id) => {
    const arrayWithoutRemoved = this.#tasks.filter((task) => {
      return task.getId() !== id;
    });
    this.#tasks = arrayWithoutRemoved;
  };

  addTask = (text) => {
    return new Promise(async (resolve, reject) => {
      fetch(this.#backend_url + "/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: text }),
      })
        .then((response) => response.json())
        .then(
          (json) => {
            const task = this.#addToArray(json.id, text);
            resolve(task);
          },
          (error) => {
            reject(error);
          }
        );
    });
  };

  removeTask = (id) => {
    return new Promise(async (resolve, reject) => {
      fetch(this.#backend_url + "/delete/" + id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(
          (json) => {
            this.#removeFromArray(id);
            resolve(json.id);
          },
          (error) => {
            reject(error);
          }
        );
    });
  };
}

export { Todos };
