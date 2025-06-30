import React from "react";
import { useDrag } from "react-dnd";

export default function DraggableBlock({ type, content }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "BLOCK",
    item: { type, content },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getColor = () => {
    if (type === "event") return "bg-yellow-500";
    if (type === "motion") return "bg-blue-500";
    return "bg-gray-300";
  };

  return (
    <div
      ref={dragRef}
      className={`flex flex-row flex-wrap ${getColor()} text-white px-2 py-1 my-2 text-sm cursor-pointer`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {content.replaceAll("_", " ")}
    </div>
  );
}
