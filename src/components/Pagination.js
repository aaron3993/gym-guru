import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="pagination">
      <button onClick={() => handlePageChange(currentPage - 1)}>
        &lt; Prev
      </button>
      <span>{`${currentPage} of ${totalPages}`}</span>
      <button onClick={() => handlePageChange(currentPage + 1)}>
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
