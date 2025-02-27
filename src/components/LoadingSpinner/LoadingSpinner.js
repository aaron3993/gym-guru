import React from "react";
import { Spin } from "antd";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = "large", tip = "Loading..." }) => {
  return (
    <div className="custom-spin">
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default LoadingSpinner;
