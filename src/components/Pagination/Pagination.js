import React from "react";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className={`pagination-btn ${isFirstPage ? "disabled" : ""}`}
        disabled={isFirstPage}
      >
        <LeftOutlined />
      </button>
      <span className="pagination-text">{`${currentPage} / ${totalPages}`}</span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className={`pagination-btn ${isLastPage ? "disabled" : ""}`}
        disabled={isLastPage}
      >
        <RightOutlined />
      </button>
    </div>
  );
};

export default Pagination;
