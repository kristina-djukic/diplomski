// src/components/Pagination.js
import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <nav>
      <ul className="pagination justify-content-center">
        {/* Prev arrow */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>

        {/* Page numbers 1..totalPages */}
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <li
              key={page}
              className={`page-item ${page === currentPage ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* Next arrow */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}
