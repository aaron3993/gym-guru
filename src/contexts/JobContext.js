import React, { createContext, useState, useContext, useEffect } from "react";
import {
  startJobInFirestore,
  monitorJobInFirestore,
  completeJobInFirestore,
  cancelJobInFirestore,
} from "../utils/firestoreUtils";
import { message } from "antd";

const JobContext = createContext();

export const useJob = () => {
  return useContext(JobContext);
};

export const JobProvider = ({ children }) => {
  const [jobState, setJobState] = useState({
    jobId: null,
    status: null,
  });

  // useEffect(() => {
  //   if (jobState.jobId) {
  //     // Monitor updates from Firestore when jobId is available
  //     const unsubscribe = monitorJobInFirestore(jobState.jobId, (jobData) => {
  //       setJobState({
  //         jobId: jobData.jobId,
  //         status: jobData.status,
  //       });
  //     });

  //     // Cleanup listener when job state is reset or component unmounts
  //     return () => unsubscribe();
  //   }
  // }, [jobState.jobId]);
  // Start a new job
  const startJob = async (userId) => {
    try {
      const jobId = await startJobInFirestore(userId);

      setJobState((prevState) => ({
        ...prevState,
        status: "pending",
      }));
      // monitorJobInFirestore(jobId, (jobData) => {

      //   // Handle job completion
      //   if (jobData.status === "completed") {
      //     message.success("Job completed successfully!");
      //   }

      //   // Handle cancellation
      //   if (jobData.status === "cancelled") {
      //     message.error("Job was cancelled.");
      //   }
      // });
      return jobId;
    } catch (error) {
      message.error(`Error starting job: ${error.message}`);
    }
  };

  const completeJob = async (jobId) => {
    if (!jobId) return;

    try {
      await completeJobInFirestore(jobId);
      setJobState((prevState) => ({
        ...prevState,
        status: "completed",
      }));
    } catch (error) {
      message.error(`Error completing job: ${error.message}`);
    }
  };

  const cancelJob = async () => {
    if (!jobState.jobId) return;

    try {
      await cancelJobInFirestore(jobState.jobId);
      setJobState((prevState) => ({
        ...prevState,
        status: "cancelled",
        isRunning: false,
      }));
    } catch (error) {
      message.error(`Error cancelling job: ${error.message}`);
    }
  };

  const resetJobState = () => {
    setJobState({
      jobId: null,
      isRunning: false,
      status: null,
      result: null,
    });
  };

  return (
    <JobContext.Provider
      value={{
        jobState,
        startJob,
        completeJob,
        cancelJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
