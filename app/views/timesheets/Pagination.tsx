// /src/views/timesheets/TimesheetListView/Pagination.tsx
import { Link } from "react-router";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  getPaginationLink: (pageNumber: number) => string;
}

export default function Pagination({
  currentPage,
  totalPages,
  getPaginationLink,
}: PaginationProps) {
  return (
    <nav aria-label="Page navigation" className="mt-4">
      <ul className="flex items-center -space-x-px h-8 text-sm">
        <li>
          {currentPage > 1 ? (
            <Link
              to={getPaginationLink(currentPage - 1)}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l hover:bg-gray-100 hover:text-gray-700"
            >
              <span className="sr-only">Previous</span>
              &laquo;
            </Link>
          ) : (
            <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-400 bg-gray-100 border border-gray-300 rounded-l">
              &laquo;
            </span>
          )}
        </li>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNumber = idx + 1;
          return (
            <li key={pageNumber}>
              {pageNumber === currentPage ? (
                <span
                  aria-current="page"
                  className="z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50"
                >
                  {pageNumber}
                </span>
              ) : (
                <Link
                  to={getPaginationLink(pageNumber)}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                >
                  {pageNumber}
                </Link>
              )}
            </li>
          );
        })}
        <li>
          {currentPage < totalPages ? (
            <Link
              to={getPaginationLink(currentPage + 1)}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r hover:bg-gray-100 hover:text-gray-700"
            >
              <span className="sr-only">Next</span>
              &raquo;
            </Link>
          ) : (
            <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-400 bg-gray-100 border border-gray-300 rounded-r">
              &raquo;
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
