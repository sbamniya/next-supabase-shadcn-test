"use client";

import { SKILL_TABLE_NAME } from "@/lib/constant";
import { supabaseClient } from "@/lib/superbase";
import { DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { useSkillsContext } from "./SkillsProvider";
import { SortableItem } from "./SortableItem";

export type Skill = {
  id: string;
  skill: string;
  sequence_number: number;
  created_at: string;
};

const SkillList = () => {
  const skillData = useSkillsContext();
  const realtimeSkills = skillData?.skills || [];

  const [items, setItem] = useState(realtimeSkills);

  useEffect(() => {
    setItem(realtimeSkills);
  }, [realtimeSkills]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over?.id) {
      const oldIndex = items.findIndex(({ id }) => id === active.id);
      const newIndex = items.findIndex(({ id }) => id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      skillData?.setSkills(newItems);

      await supabaseClient
        .from(SKILL_TABLE_NAME)
        .upsert(
          newItems.map((obj, sequence_number) => ({ ...obj, sequence_number }))
        );
    }
  };

  return (
    <div>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={items}>
          {items.map(({ id, skill }) => (
            <SortableItem key={id} id={id}>
              <div className="w-full p-2 border-2	border-slate-200 rounded-sm">
                {skill}
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SkillList;
