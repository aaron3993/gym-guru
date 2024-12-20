import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  startJobInFirestore,
  monitorJobInFirestore,
  completeJobInFirestore,
  getPendingJobForUser,
} from "../utils/firestoreUtils";
import { message, notification } from "antd";

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
    if (!isAuthenticated) return;

    const fetchAndMonitorJob = async () => {
      try {
        if (user && user.uid) {
          const userJob = await getPendingJobForUser(user.uid);
          if (userJob && userJob.jobId) {
            setJobState({
              jobId: userJob.jobId,
              status: userJob.status,
            });
            if (userJob.jobId) {
              const unsubscribe = monitorJobInFirestore(
                userJob.jobId,
                (jobData) => {
                  setJobState({
                    jobId: jobData.jobId,
                    status: jobData.status,
                  });
                  if (jobData.status === "completed") {
                    notification.success({
                      message: "Routine Generated",
                      description:
                        "Your routine generation has been successfully completed.",
                      placement: "topRight",
                    });
                  }
                }
              );

              return () => unsubscribe();
            }
          }
        }
      } catch (error) {
        console.error("Error fetching or monitoring job:", error);
      }
    };

    fetchAndMonitorJob();
  }, [user]);

  const startJob = async (userId) => {
    try {
      const jobId = await startJobInFirestore(userId);

      setJobState(() => ({
        jobId,
        status: "pending",
      }));
      monitorJobInFirestore(jobId, (jobData) => {
        if (jobData.status === "completed") {
          notification.success({
            message: "Routine Generated",
            description:
              "Your routine generation has been successfully completed.",
            placement: "topRight",
          });
        }
      });
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

  return (
    <JobContext.Provider
      value={{
        jobState,
        startJob,
        completeJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
