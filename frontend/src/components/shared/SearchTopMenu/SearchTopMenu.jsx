import React from 'react';
import TopMenu from '../TopMenu/TopMenu';
import search3Svg from '../../../assets/icons/search-3.svg';

const SearchTopMenu = ({ className }) => {
  return (
    <TopMenu
      className={className}
      searchFieldIconOutlinedSearch={search3Svg}
      placeholder="Search..."
    />
  );
};

export default SearchTopMenu; 