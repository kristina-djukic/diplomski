import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination d-flex justify-content-center my-4">
      <button
        className="btn btn-outline-primary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Prev
      </button>
      <span className="mx-3 align-self-center">
        {currentPage} / {totalPages}
      </span>
      <button
        className="btn btn-outline-primary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
