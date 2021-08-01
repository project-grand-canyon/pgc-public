export const loadCallsAndNotifications = () => {
  const calls = _load("calls")
  const notification = _load("notification")
  return { calls, notification }
};

export const saveNotification = (notification) => {
  _save("notification", notification)
};

export const saveCalls = (calls) => {
  _save("calls", calls)
};

const _load = (itemType) => {
  try {
    const serializedState = localStorage.getItem(itemType);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

const _save = (itemType, items) => {
  try {
    const serializedState = JSON.stringify(items);
    localStorage.setItem(itemType, serializedState);
  } catch {
    // ignore write errors
  }
}