"use client";

import useSkills, { SkillsReturnType } from "@/lib/hooks/useSkill";
import { PropsWithChildren, createContext, useContext } from "react";
import { Skill } from "./SkillList";

const SkillsContext = createContext<SkillsReturnType | null>(null);

export const useSkillsContext = (): SkillsReturnType | null =>
  useContext(SkillsContext);

export function SkillsProvider({
  children,
  skills,
}: PropsWithChildren<{ skills: Skill[] }>) {
  const skillData = useSkills(skills);
  return (
    <SkillsContext.Provider value={skillData}>
      {children}
    </SkillsContext.Provider>
  );
}
