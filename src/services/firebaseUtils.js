import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
export const callCloudFunction = async (functionName, data) => {
    try {
      const cloudFunction = httpsCallable(functions, functionName);
      const result = await cloudFunction(data || {});
      return result.data;
    } catch (error) {
      console.error(`Cloud Function (${functionName}) Error:`, error);
      throw error;
    }
  };