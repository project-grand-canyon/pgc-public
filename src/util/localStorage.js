export const loadCalls = () => {
    try {
      const serializedState = localStorage.getItem('calls');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };

  export const saveCalls = (calls) => {
    try {
      const serializedState = JSON.stringify(calls);
      localStorage.setItem('calls', serializedState);
    } catch {
      // ignore write errors
    }
  };