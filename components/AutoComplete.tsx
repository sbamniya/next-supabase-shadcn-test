"use client";

import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SKILL_TABLE_NAME } from "@/lib/constant";
import { supabaseClient } from "@/lib/superbase";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { useSkillsContext } from "./SkillsProvider";

type Option = {
  label: string;
  value: string;
};

const OPTIONS: Option[] = [
  "Python",
  "C++",
  "C",
  "C#",
  "Java",
  "JavaScript",
  "PHP",
  "PERL",
  "TypeScript",
  "React",
  "Node",
  "MongoDB",
  "MySQL",
  "Postgres",
  "Angular",
  "Vue.js",
]
  .sort()
  .map((skill) => ({ label: skill, value: skill }));

const AutoComplete = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const skillData = useSkillsContext();
  const skills = skillData?.skills || [];

  const databaseOptions = (skills || []).map(({ skill }) => ({
    label: skill,
    value: skill,
  }));

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option[]>(databaseOptions);

  const [inputValue, setInputValue] = useState<string>();

  const createNewItem = async (skill: string) => {
    await supabaseClient.from(SKILL_TABLE_NAME).insert({
      skill,
      sequence_number: selected.length + 1,
    });
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      if (!isOpen) {
        setOpen(true);
      }

      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = OPTIONS.find(
          (option) => option.label === input.value
        );
        if (optionToSelect) {
          setSelected([optionToSelect]);
        } else {
          createNewItem(input.value);
        }
        input.value = "";
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen]
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue("");
  }, [selected]);

  const handleSelectOption = useCallback(
    async (selectedOption: Option) => {
      const selectedIndex = selected.findIndex(
        ({ label }) => label === selectedOption.label
      );

      const isPreviouslySelected = selectedIndex > -1;
      setSelected((prevSelected) => {
        if (isPreviouslySelected) {
          prevSelected.splice(selectedIndex, 1);
        } else {
          prevSelected.push(selectedOption);
        }
        return prevSelected;
      });

      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);

      if (!isPreviouslySelected) {
        createNewItem(selectedOption.label);
      } else {
        await supabaseClient
          .from(SKILL_TABLE_NAME)
          .delete()
          .eq("skill", selectedOption.label);
      }
    },
    [selected]
  );

  const combinedOptions = [...OPTIONS, ...databaseOptions];
  const finalOptions = combinedOptions.filter(
    (option, index) =>
      combinedOptions.findIndex((op) => op.label === option.label) === index
  );

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder="Select Skill"
          className="text-base"
        />
      </div>
      <div className="mt-1 relative">
        {isOpen ? (
          <div className="absolute top-0 z-10 w-full rounded-xl bg-stone-50 outline-none animate-in fade-in-0 zoom-in-95">
            <CommandList className="ring-1 ring-slate-200 rounded-lg">
              <CommandGroup>
                {finalOptions.map((skill) => {
                  const isSelected = selected.find(
                    ({ label }) => label === skill.value
                  );

                  return (
                    <CommandItem
                      key={skill.value}
                      value={skill.value}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(skill)}
                      className={cn(
                        "flex items-center gap-2 w-full",
                        !isSelected ? "pl-8" : null
                      )}
                    >
                      {isSelected ? <Check className="w-4" /> : null}
                      {skill.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-sm text-center">
                Please enter/return to Create New
              </CommandPrimitive.Empty>
            </CommandList>
          </div>
        ) : null}
      </div>
    </CommandPrimitive>
  );
};

export default AutoComplete;
