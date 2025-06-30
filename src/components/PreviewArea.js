import React, { useEffect, useRef } from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({ sprites, setSprites }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDragging = false;
    let dragSpriteId = null;
    let offsetX = 0;
    let offsetY = 0;

    const handleMouseDown = (e) => {
      const target = e.target.closest(".sprite-draggable");
      if (!target) return;

      isDragging = true;
      dragSpriteId = parseInt(target.dataset.id);
      const rect = target.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
    };

    const handleMouseMove = (e) => {
      if (!isDragging || dragSpriteId === null) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - offsetX;
      const y = e.clientY - rect.top - offsetY;

      setSprites((prev) =>
        prev.map((sprite) =>
          sprite.id === dragSpriteId ? { ...sprite, x, y } : sprite
        )
      );
    };

    const handleMouseUp = () => {
      isDragging = false;
      dragSpriteId = null;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setSprites]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gray-100 border p-2 overflow-hidden"
    >
      {sprites.map((sprite) => (
        <div
          key={sprite.id}
          className="absolute sprite-draggable cursor-move"
          data-id={sprite.id}
          style={{
            left: sprite.x,
            top: sprite.y,
            width: "100px",
            height: "100px",
            transform: `rotate(${sprite.rotation || 0}deg)`
          }}
        >
          <CatSprite />
          {sprite.saying && (
            <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs">
              {sprite.saying}
            </div>
          )}
          {sprite.thinking && (
            <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs italic">
              {sprite.thinking}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
