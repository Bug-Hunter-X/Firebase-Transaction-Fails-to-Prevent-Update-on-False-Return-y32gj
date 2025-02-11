// bugSolution.js
const database = firebase.database();

function updateDataWithRetry(path, updateFunction, attempts = 3) {
  return database.ref(path).transaction(updateFunction).then((transactionResult) => {
    if (!transactionResult.committed) {
      if (attempts > 1) {
        console.log(`Transaction failed, retrying... Attempts remaining: ${attempts - 1}`);
        return updateDataWithRetry(path, updateFunction, attempts - 1);
      } else {
        console.error('Transaction failed after multiple retries.');
        throw new Error('Transaction failed after multiple retries.');
      }
    } else {
      console.log('Transaction committed successfully.');
    }
  });
}

// Example usage:
updateDataWithRetry('path/to/data', (currentData) => {
  // Your update logic here
  if (someCondition) {
    return { ...currentData, ...newData }; 
  } else {
    return null; // Indicate failure
  }
});