const clock = document.getElementById("clock");
const clockLarge = document.getElementById("clockLarge");
const clockDate = document.getElementById("clockDate");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchEngine = document.getElementById("searchEngine");
const todoInput = document.getElementById("todoInput");
const addTodoButton = document.getElementById("addTodo");
const todoList = document.getElementById("todoList");
const clearTodoButton = document.getElementById("clearTodo");
const noteText = document.getElementById("noteText");
const saveNoteButton = document.getElementById("saveNote");
const linkNameInput = document.getElementById("linkName");
const linkUrlInput = document.getElementById("linkUrl");
const addLinkButton = document.getElementById("addLink");
const quickLinksList = document.getElementById("quickLinksList");

function formatTime(date) {
  return date.toLocaleTimeString("zh-CN", { hour12: false });
}

function formatDate(date) {
  return date.toLocaleDateString("zh-CN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function updateClock() {
  const now = new Date();
  clock.textContent = formatTime(now);
  clockLarge.textContent = formatTime(now);
  clockDate.textContent = formatDate(now);
}

function loadFromStorage() {
  const todos = JSON.parse(localStorage.getItem("myHomepageTodos") || "[]");
  todos.forEach((task) => addTodoItem(task));

  const note = localStorage.getItem("myHomepageNote") || "";
  noteText.value = note;

  loadQuickLinks();
}

function saveTodos() {
  const tasks = Array.from(todoList.querySelectorAll("li span")).map((span) => span.textContent);
  localStorage.setItem("myHomepageTodos", JSON.stringify(tasks));
}

function saveQuickLinks(links) {
  localStorage.setItem("myHomepageLinks", JSON.stringify(links));
}

function createLinkItem(link) {
  const item = document.createElement("li");
  item.dataset.name = link.name;
  item.dataset.url = link.url;
  item.className = "todo-item";
  item.innerHTML = `
    <a href="${link.url}" target="_blank" rel="noopener">${link.name}</a>
    <button type="button" aria-label="删除链接">删除</button>
  `;
  item.querySelector("button").addEventListener("click", () => {
    item.remove();
    const remaining = Array.from(quickLinksList.querySelectorAll("li")).map((li) => ({
      name: li.dataset.name,
      url: li.dataset.url,
    }));
    saveQuickLinks(remaining);
  });
  quickLinksList.appendChild(item);
}

function loadQuickLinks() {
  const saved = JSON.parse(localStorage.getItem("myHomepageLinks") || "null");
  const defaultLinks = [
    { name: "百度", url: "https://www.baidu.com" },
    { name: "Google", url: "https://www.google.com" },
    { name: "邮箱", url: "https://mail.163.com" },
    { name: "B站", url: "https://www.bilibili.com" },
  ];
  const links = Array.isArray(saved) && saved.length ? saved : defaultLinks;
  quickLinksList.innerHTML = "";
  links.forEach(createLinkItem);
  saveQuickLinks(links);
}

function addTodoItem(text) {
  if (!text || !text.trim()) return;
  const item = document.createElement("li");
  item.className = "todo-item";
  item.innerHTML = `
    <span>${text}</span>
    <button type="button" aria-label="删除任务">删除</button>
  `;
  item.querySelector("button").addEventListener("click", () => {
    item.remove();
    saveTodos();
  });
  todoList.appendChild(item);
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = encodeURIComponent(searchInput.value.trim());
  if (!query) return;
  const url = `${searchEngine.value}${query}`;
  window.open(url, "_blank");
});

addTodoButton.addEventListener("click", () => {
  const value = todoInput.value.trim();
  if (!value) return;
  addTodoItem(value);
  todoInput.value = "";
  saveTodos();
});

clearTodoButton.addEventListener("click", () => {
  todoList.innerHTML = "";
  localStorage.removeItem("myHomepageTodos");
});

addLinkButton.addEventListener("click", () => {
  const name = linkNameInput.value.trim();
  let url = linkUrlInput.value.trim();
  if (!name || !url) return;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  const link = { name, url };
  createLinkItem(link);
  const links = Array.from(quickLinksList.querySelectorAll("li")).map((li) => ({
    name: li.dataset.name,
    url: li.dataset.url,
  }));
  saveQuickLinks(links);
  linkNameInput.value = "";
  linkUrlInput.value = "";
});

saveNoteButton.addEventListener("click", () => {
  localStorage.setItem("myHomepageNote", noteText.value);
  saveNoteButton.textContent = "已保存";
  setTimeout(() => {
    saveNoteButton.textContent = "保存";
  }, 1200);
});

noteText.addEventListener("input", () => {
  saveNoteButton.textContent = "保存";
});

window.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);
  loadFromStorage();
});
