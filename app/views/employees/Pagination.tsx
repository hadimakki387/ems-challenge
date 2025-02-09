// /src/views/EmployeeList/Pagination.tsx
import { Link } from "react-router";

interface PaginationProps {
  page: number;
  totalPages: number;
  search: string;
  sortField: string;
  sortOrder: "asc" | "desc";
  filterDepartment: string;
  pageSize: number;
}

export default function Pagination({
  page,
  totalPages,
  search,
  sortField,
  sortOrder,
  filterDepartment,
  pageSize,
}: PaginationProps) {
  const getPaginationLink = (pageNumber: number) =>
    `?search=${encodeURIComponent(
      search
    )}&sortField=${sortField}&sortOrder=${sortOrder}&filterDepartment=${encodeURIComponent(
      filterDepartment
    )}&page=${pageNumber}&pageSize=${pageSize}`;

  return (
    <nav aria-label="Page navigation example" className="mt-4">
      <ul className="flex items-center -space-x-px h-8 text-sm">
        <li>
          {page > 1 ? (
            <Link
              to={getPaginationLink(page - 1)}
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </Link>
          ) : (
            <span className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-400 bg-gray-100 border border-e-0 border-gray-300 rounded-s-lg">
              <span className="sr-only">Previous</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </span>
          )}
        </li>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNumber = idx + 1;
          return (
            <li key={pageNumber}>
              {pageNumber === page ? (
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
          {page < totalPages ? (
            <Link
              to={getPaginationLink(page + 1)}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </Link>
          ) : (
            <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-400 bg-gray-100 border border-gray-300 rounded-e-lg">
              <span className="sr-only">Next</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
