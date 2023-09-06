import { Skill } from "@/components/SkillList";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { SKILL_TABLE_NAME } from "../constant";
import { supabaseClient } from "../superbase";

export type SkillsReturnType = {
  skills: Skill[];
  setSkills: Dispatch<SetStateAction<Skill[]>>;
  refetchSkills: () => Promise<void>
};

export default function useSkills(serverSkills: Skill[]): SkillsReturnType {
  const [skills, setSkills] = useState(serverSkills);

  const refetchSkills = useCallback(async () => {
    const { data: newSkills } = await supabaseClient
      .from("skills")
      .select()
      .order("sequence_number", {
        ascending: true,
      });
    setSkills(newSkills as Skill[]);
  }, []);

  useEffect(() => {
    function handleInsert(newRecord: Skill) {
      setSkills((prevSkills) => [...prevSkills, newRecord]);
    }

    function handleDelete(id: string) {
      setSkills((prevSkills) => {
        const newSkills = [...prevSkills];
        const indexToRemove = newSkills.findIndex(
          ({ id: prevId }) => prevId === id
        );
        newSkills.splice(indexToRemove, 1);
        return newSkills;
      });
    }

    const channel = supabaseClient
      .channel("realtime-post-insert")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: SKILL_TABLE_NAME,
        },
        async (data) => {
          if (data.eventType === "INSERT") {
            handleInsert(data.new as Skill);
          }
          if (data.eventType === "DELETE") {
            handleDelete(data.old.id);
          }

          if (data.eventType === "UPDATE") {
            refetchSkills();
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [refetchSkills]);

  return { skills, setSkills, refetchSkills };
}
