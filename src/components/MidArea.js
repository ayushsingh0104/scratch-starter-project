import React from "react";
import { useDrop } from "react-dnd";

export default function MidArea({ blocks, setBlocks }) {
  const [, dropRef] = useDrop(() => ({
    accept: "BLOCK",
    drop: (item) => {
      const newBlock = { ...item };

      if (item.content === "go_to_xy") {
        newBlock.x = 0;
        newBlock.y = 0;
      } else if (item.content === "move_10_steps") {
        newBlock.steps = 10;
      } else if (item.content === "turn_left_15" || item.content === "turn_right_15") {
        newBlock.degrees = 15;
      } else if (item.content === "say_for_seconds" || item.content === "think_for_seconds") {
        newBlock.message = "";
        newBlock.seconds = 2;
      } else if (item.content === "repeat") {
        newBlock.times = 2;
        newBlock.nested = [];
      }

      setBlocks(prev => Array.isArray(prev) ? [...prev, newBlock] : [newBlock]);
    }
  }));

  const updateBlock = (index, key, value) => {
    const updated = [...blocks];
    updated[index][key] = value;
    setBlocks(updated);
  };

  return (
    <div ref={dropRef} className="flex-1 h-full overflow-auto p-2 border border-dashed border-gray-400">
      <h2 className="text-lg font-semibold mb-2">Script Area</h2>
      {blocks.map((block, index) => (
        <div
          key={index}
          className={`p-2 my-1 text-sm text-white rounded ${
            block.type === "event" ? "bg-yellow-500" : "bg-blue-500"
          }`}
        >
          {block.content.replaceAll("_", " ")}
          {block.content === "go_to_xy" && (
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                value={block.x}
                onChange={(e) => updateBlock(index, "x", parseInt(e.target.value))}
                placeholder="x"
                className="text-black w-12 px-1"
              />
              <input
                type="number"
                value={block.y}
                onChange={(e) => updateBlock(index, "y", parseInt(e.target.value))}
                placeholder="y"
                className="text-black w-12 px-1"
              />
            </div>
          )}
          {block.content === "move_10_steps" && (
            <input
              type="number"
              value={block.steps}
              onChange={(e) => updateBlock(index, "steps", parseInt(e.target.value))}
              className="text-black w-16 mt-1 px-1"
            />
          )}
          {(block.content === "turn_left_15" || block.content === "turn_right_15") && (
            <input
              type="number"
              value={block.degrees}
              onChange={(e) => updateBlock(index, "degrees", parseInt(e.target.value))}
              className="text-black w-16 mt-1 px-1"
            />
          )}
          {(block.content === "say_for_seconds" || block.content === "think_for_seconds") && (
            <div className="flex flex-col gap-1 mt-1">
              <input
                type="text"
                value={block.message}
                onChange={(e) => updateBlock(index, "message", e.target.value)}
                placeholder="Message"
                className="text-black px-1"
              />
              <input
                type="number"
                value={block.seconds}
                onChange={(e) => updateBlock(index, "seconds", parseInt(e.target.value))}
                placeholder="Seconds"
                className="text-black w-16 px-1"
              />
            </div>
          )}
          {block.content === "repeat" && (
            <input
              type="number"
              value={block.times}
              onChange={(e) => updateBlock(index, "times", parseInt(e.target.value))}
              className="text-black w-16 mt-1 px-1"
            />
          )}
        </div>
      ))}
    </div>
  );
}
