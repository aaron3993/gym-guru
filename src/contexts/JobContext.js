import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  startJobInFirestore,
  monitorJobInFirestore,
  completeJobInFirestore,
  cancelJobInFirestore,
  getPendingJobForUser,
} from "../utils/firestoreUtils";
import { message } from "antd";

const JobContext = createContext();

export const useJob = () => {
  return useContext(JobContext);
};

export const JobProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [jobState, setJobState] = useState({
    jobId: null,
    status: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchUserJob = async () => {
      try {
        if (user && user.uid) {
          const userJob = await getPendingJobForUser(user.uid);
          if (userJob && userJob.jobId) {
            setJobState({
              jobId: userJob.jobId,
              status: userJob.status,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user job:", error);
      }
    };

    fetchUserJob();
  }, [user, isAuthenticated]);

  // useEffect(() => {
  //   if (jobState.jobId) {
  //     const unsubscribe = monitorJobInFirestore(jobState.jobId, (jobData) => {
  //       setJobState({
  //         jobId: jobData.jobId,
  //         status: jobData.status,
  //       });
  //       console.log(jobData.status);
  //     });
  //     return () => unsubscribe();
  //   }
  // }, [jobState.jobId]);

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
