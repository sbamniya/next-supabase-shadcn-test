"use client";

import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { Skill } from "./SkillList";

const Autocomplete = ({ items }: { items: Skill[] }) => {
  const handleOnSearch = (string: string, results: any) => {
    console.log({ string, results });
  };

  const handleOnHover = (result: any) => {
    // the item hovered
    console.log(result);
  };

  const handleOnSelect = (item: any) => {
    // the item selected
    console.log({ item });
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  return (
    <div className="w-full">
      <ReactSearchAutocomplete
        items={items.map(({ id, skill: name }) => ({ id, name }))}
        onSearch={handleOnSearch}
        onHover={handleOnHover}
        onSelect={handleOnSelect}
        onFocus={handleOnFocus}
        autoFocus
      />
    </div>
  );
};

export default Autocomplete;
