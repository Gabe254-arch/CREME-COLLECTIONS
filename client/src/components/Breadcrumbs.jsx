// components/Breadcrumbs.jsx
import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

/**
 * 🧭 Breadcrumbs Component
 * Displays current navigation path based on category and subcategory slugs.
 */
const Breadcrumbs = () => {
  const { categorySlug, subSlug } = useParams();
  const location = useLocation();

  const formatSlug = (slug) =>
    slug?.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-sm text-gray-600 mb-4 px-2 md:px-0"
    >
      <ul className="flex items-center flex-wrap space-x-1">
        <li>
          <Link
            to="/"
            className="text-blue-600 hover:text-orange-500 transition-all duration-150"
          >
            Home
          </Link>
        </li>
        {location.pathname !== '/' && <li className="mx-1 text-gray-400">/</li>}
        <li>
          <Link
            to="/shop"
            className="text-blue-600 hover:text-orange-500 transition-all duration-150"
          >
            Shop
          </Link>
        </li>
        {categorySlug && (
          <>
            <li className="mx-1 text-gray-400">/</li>
            <li>
              <Link
                to={`/shop/${categorySlug}`}
                className="text-orange-600 hover:underline transition-all duration-150"
              >
                {formatSlug(categorySlug)}
              </Link>
            </li>
          </>
        )}
        {subSlug && (
          <>
            <li className="mx-1 text-gray-400">/</li>
            <li className="text-orange-500 font-semibold">
              {formatSlug(subSlug)}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
