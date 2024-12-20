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

  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAndMonitorJob = async () => {
      try {
        if (user && user.uid) {
          const userJob = await getPendingJobForUser(user.uid);
          if (userJob && userJob.jobId) {
            setJobId(userJob.jobId);
            setStatus(userJob.status);

            if (userJob.jobId) {
              const unsubscribe = monitorJobInFirestore(
                userJob.jobId,
                (jobData) => {
                  setJobId(jobData.jobId);
                  setStatus(jobData.status);

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
  }, [user, isAuthenticated]);

  const startJob = async (userId) => {
    try {
      const newJobId = await startJobInFirestore(userId);

      setJobId(newJobId);
      setStatus("pending");

      monitorJobInFirestore(newJobId, (jobData) => {
        if (jobData.status === "completed") {
          notification.success({
            message: "Routine Generated",
            description:
              "Your routine generation has been successfully completed.",
            placement: "topRight",
          });
        }
      });

      return newJobId;
    } catch (error) {
      message.error(`Error starting job: ${error.message}`);
    }
  };

  const completeJob = async (jobId) => {
    if (!jobId) return;

    try {
      await completeJobInFirestore(jobId);
      setStatus("completed");
    } catch (error) {
      message.error(`Error completing job: ${error.message}`);
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobId,
        status,
        startJob,
        completeJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
