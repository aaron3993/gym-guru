import React, { createContext, useState, useContext } from "react";

const BackgroundJobContext = createContext();

export const BackgroundJobProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);

  const runJob = async (jobFunction) => {
    setIsRunning(true);
    console.log(isRunning);
    try {
      const result = await jobFunction();
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsRunning(false);
      console.log(isRunning);
    }
  };

  return (
    <BackgroundJobContext.Provider value={{ isRunning, runJob }}>
      {children}
    </BackgroundJobContext.Provider>
  );
};

export const useBackgroundJob = () => {
  const context = useContext(BackgroundJobContext);
  if (!context) {
    throw new Error(
      "useBackgroundJob must be used within BackgroundJobProvider"
    );
  }
  return context;
};
