import React from "react";
import { useDrag } from "react-dnd";

const Block = ({ content, type }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "BLOCK",
    item: { content, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      className={`px-3 py-1 rounded mb-2 cursor-move text-white ${
        type === "event" ? "bg-yellow-500" : type === "looks" ? "bg-purple-500" : "bg-blue-500"
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {content.replaceAll("_", " ")}
    </div>
  );
};

export default function Sidebar() {
  return (
    <div className="w-60 p-4 bg-gray-100 border-r">
      <h2 className="text-lg font-bold mb-2">Events</h2>
      <Block content="when_flag_clicked" type="event" />
      <Block content="when_sprite_clicked" type="event" />

      <h2 className="text-lg font-bold mt-4 mb-2">Motion</h2>
      <Block content="move_10_steps" type="motion" />
      <Block content="turn_left_15" type="motion" />
      <Block content="turn_right_15" type="motion" />
      <Block content="go_to_xy" type="motion" />
      <Block content="repeat" type="motion" />

      <h2 className="text-lg font-bold mt-4 mb-2">Looks</h2>
      <Block content="say_for_seconds" type="looks" />
      <Block content="think_for_seconds" type="looks" />
    </div>
  );
}
