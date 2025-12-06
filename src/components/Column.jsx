import React, { useState, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import ComponentItem from "./ComponentItem";

const Column = ({ column, onItemClick, onResizeColumn }) => {
  const [isResizing, setIsResizing] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(column.height);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column" },
  });

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    startYRef.current = e.clientY;
    startHeightRef.current = column.height;

    const handleMouseMove = (moveEvent) => {
      if (!isResizing) return;
      const deltaY = moveEvent.clientY - startYRef.current;
      const newHeight = Math.max(100, startHeightRef.current + deltaY);
      onResizeColumn(column.id, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ height: `${column.height}px` }}
      className={`flex-1 min-w-[200px] bg-white rounded-lg border ${
        isOver ? "border-green-300" : "border-gray-300"
      } 
        p-3 relative transition-all ${isResizing ? "cursor-row-resize" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600 px-2 py-1 bg-gray-100 rounded">
          Column: {column.id}
        </span>
      </div>

      <div className="space-y-3 h-[calc(100%-40px)] overflow-y-auto">
        {column.children.map((component) => (
          <ComponentItem
            key={component.id}
            component={component}
            onClick={() => onItemClick(component.id)}
          />
        ))}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gray-300 to-transparent 
          opacity-30 hover:opacity-100 cursor-row-resize transition-opacity"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default Column;
