import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import PlayButton from "./components/PlayButton";

export default function App() {
  const [sprites, setSprites] = useState([
    {
      id: 1,
      name: "Sprite 1",
      x: 100,
      y: 100,
      rotation: 0,
      script: [],
      initialX: 100,
      initialY: 100,
    },
    {
      id: 2,
      name: "Sprite 2",
      x: 200,
      y: 100,
      rotation: 0,
      script: [],
      initialX: 200,
      initialY: 100,
    },
  ]);

  const [selectedSpriteId, setSelectedSpriteId] = useState(1);

  const updateSpriteScript = (spriteId, blocks) => {
    setSprites((prev) =>
      prev.map((s) =>
        s.id === spriteId ? { ...s, script: Array.isArray(blocks) ? blocks : [] } : s
      )
    );
  };

  const updateSpritePosition = (id, x, y) => {
    setSprites((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, x, y, initialX: x, initialY: y } : s
      )
    );
  };

  const handlePlay = () => {
    const updatedSprites = sprites.map((sprite) => {
      let x = sprite.initialX;
      let y = sprite.initialY;
      let rotation = 0;
      let saying = null;
      let thinking = null;
      const script = Array.isArray(sprite.script) ? sprite.script : [];

      script.forEach((block) => {
        if (block.content === "move_10_steps") {
          x += parseInt(block.steps || 10);
        } else if (block.content === "turn_left_15") {
          rotation -= parseInt(block.degrees || 15);
        } else if (block.content === "turn_right_15") {
          rotation += parseInt(block.degrees || 15);
        } else if (block.content === "go_to_xy") {
          x = parseInt(block.x || 0);
          y = parseInt(block.y || 0);
        } else if (block.content === "say_for_seconds") {
          saying = block.message || "Hello!";
        } else if (block.content === "think_for_seconds") {
          thinking = block.message || "Hmm...";
        } else if (block.content === "repeat") {
          const times = parseInt(block.times || 1);
          for (let i = 0; i < times; i++) {
            block.nested?.forEach((nestedBlock) => {
              if (nestedBlock.content === "move_10_steps") {
                x += parseInt(nestedBlock.steps || 10);
              } else if (nestedBlock.content === "turn_left_15") {
                rotation -= parseInt(nestedBlock.degrees || 15);
              } else if (nestedBlock.content === "turn_right_15") {
                rotation += parseInt(nestedBlock.degrees || 15);
              }
            });
          }
        }
      });

      return {
        ...sprite,
        x,
        y,
        rotation,
        saying,
        thinking,
      };
    });

    // Collision logic
    if (
      updatedSprites.length >= 2 &&
      Math.abs(updatedSprites[0].x - updatedSprites[1].x) < 50 &&
      Math.abs(updatedSprites[0].y - updatedSprites[1].y) < 50
    ) {
      const temp = updatedSprites[0].script;
      updatedSprites[0].script = updatedSprites[1].script;
      updatedSprites[1].script = temp;
    }

    setSprites(updatedSprites);
  };

  const selectedScript = sprites.find((s) => s.id === selectedSpriteId)?.script;

  return (
    <div className="bg-blue-100 pt-6 font-sans h-screen overflow-hidden">
      <div className="h-full flex flex-row">
        <div className="flex-1 h-full flex flex-col bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2 overflow-hidden">
          <div className="flex flex-row h-full">
            <Sidebar />
            <MidArea
              blocks={Array.isArray(selectedScript) ? selectedScript : []}
              setBlocks={(blocks) => updateSpriteScript(selectedSpriteId, blocks)}
            />
          </div>
          <div className="flex justify-between items-center p-2 border-t">
            <div className="flex gap-2">
              {sprites.map((sprite) => (
                <button
                  key={sprite.id}
                  className={`px-3 py-1 rounded ${
                    sprite.id === selectedSpriteId ? "bg-blue-500 text-white" : "bg-gray-300"
                  }`}
                  onClick={() => setSelectedSpriteId(sprite.id)}
                >
                  {sprite.name}
                </button>
              ))}
            </div>
            <PlayButton onClick={handlePlay} />
          </div>
        </div>

        <div className="w-1/3 h-full bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea
            sprites={sprites}
            setSprites={setSprites}
            updateSpritePosition={updateSpritePosition}
          />
        </div>
      </div>
    </div>
  );
}
