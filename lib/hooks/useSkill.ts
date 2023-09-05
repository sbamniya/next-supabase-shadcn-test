import { Skill } from "@/components/SkillList";
import { useEffect, useState } from "react";
import { supabaseClient } from "../superbase";

export default function useSkills(serverSkills: Skill[]) {
  const [skills, setSkills] = useState(serverSkills);

  useEffect(() => {
    const channel = supabaseClient
      .channel("realtime-post-insert")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "skills",
        },
        (data) => {
          console.log(data);
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);
  return skills;
}
