import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  startJobInFirestore,
  monitorJobInFirestore,
  completeJobInFirestore,
  getPendingJobForUser,
  getRoutineIdForJob,
} from "../utils/firestoreUtils";
import { message, notification } from "antd";

const JobContext = createContext();

export const useJob = () => {
  return useContext(JobContext);
};

export const JobProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
              const unsubscribe = monitorJobAndNotify(userJob.jobId);
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
      monitorJobAndNotify(newJobId);

      return newJobId;
    } catch (error) {
      message.error(`Error starting job: ${error.message}`);
    }
  };

  const completeJob = async (jobId, routineId) => {
    if (!jobId) return;

    try {
      await completeJobInFirestore(jobId, routineId);
      setStatus("completed");
    } catch (error) {
      message.error(`Error completing job: ${error.message}`);
    }
  };

  const monitorJobAndNotify = (jobId) => {
    monitorJobInFirestore(jobId, async (jobData) => {
      setJobId(jobData.jobId);
      setStatus(jobData.status);

      if (jobData.status === "completed") {
        const routineId = await getRoutineIdForJob(jobData.jobId);
        notification.success({
          message: "Routine Generated",
          description: "Click here to go to your routine.",
          placement: "topRight",
          style: { cursor: "pointer" },
          onClick: () => {
            if (routineId) {
              navigate(`/routines/${routineId}`);
            }
          },
        });
      }
    });
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
