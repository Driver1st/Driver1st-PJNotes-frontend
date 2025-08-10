const PREFIX = "https://pjnotes-backend-production.up.railway.app/api";

const req = (url, options = {}) => {
  const { body } = options;

  return fetch((PREFIX + url).replace(/\/\/$/, ""), {
    ...options,
    credentials: "include",
    body: body ? JSON.stringify(body) : null,
    headers: {
      ...options.headers,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
  }).then((res) =>
    res.ok
      ? res.json()
      : res.text().then((message) => {
          throw new Error(message);
        })
  );
};

export const getNotes = ({ age = "1month", page = 1 } = {}) =>
  req(`/notes?range=${age}&page=${page}`);

export const createNote = (title, text) =>
  req("/notes", {
    method: "POST",
    body: { title, text },
  });

export const getNote = (id) => req(`/notes/${id}`);

export const archiveNote = (id) =>
  req(`/notes/${id}/archive`, { method: "PUT" });

export const unarchiveNote = (id) =>
  req(`/notes/${id}/restore`, { method: "PUT" });

export const editNote = (id, title, text) =>
  req(`/notes/${id}`, {
    method: "PUT",
    body: { title, text },
  });

export const deleteNote = (id) =>
  req(`/notes/${id}`, {
    method: "DELETE",
  });

export const deleteAllArchived = () =>
  req("/notes/clear/archive", {
    method: "DELETE",
  });

export const notePdfUrl = (id) => `/notes/${id}/pdf`;
