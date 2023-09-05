"use client";

import { DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { SortableItem } from "./SortableItem";
import useSkills from "@/lib/hooks/useSkill";

export type Skill = {
  id: string;
  skill: string;
  sequence_number: number;
  created_at: string;
};

type SkillListProps = {
  skills: Skill[];
};

const SkillList = ({ skills }: SkillListProps) => {
  const realtimeSkills = useSkills(skills);
  const [items, setItem] = useState(realtimeSkills);

  useEffect(() => {
    setItem(realtimeSkills);
  }, [realtimeSkills]);

  const handleDragEnd = (event: any) => {
    const { active, over, delta } = event;

    if (delta.x < 0 || delta.y < 0) {
      console.log("delete the item.......");
      return false;
    }

    console.log(active, over, delta);

    console.log("event", event);

    if (over && active.id !== over?.id) {
      setItem((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
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
