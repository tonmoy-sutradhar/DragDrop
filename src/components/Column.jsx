import React, { useState, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import ComponentItem from "./ComponentItem";

const Column = ({ column, onItemClick, onResizeColumn }) => {
  const [isResizing, setIsResizing] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(column.height);
  const columnRef = useRef(null);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column" },
  });

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleColumnClick = (e) => {
    // Only trigger if not clicking on resize handle
    if (!e.target.classList.contains("resize-handle")) {
      onItemClick(column.id, "column");
    }
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        columnRef.current = node;
      }}
      style={{ height: `${column.height}px` }}
      onClick={handleColumnClick}
      className={`flex-1 min-w-[200px] bg-white  border ${
        isOver ? "border-green-300" : "border-blue-600"
      } 
        p-3 relative transition-all ${
          isResizing ? "cursor-row-resize" : "cursor-pointer"
        } hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600 px-2 py-1 bg-gray-100 rounded">
          {column.id}
        </span>
      </div>

      <div className="space-y-3 h-[calc(100%-40px)] overflow-y-auto">
        {column.children.map((component) => (
          <ComponentItem
            key={component.id}
            component={component}
            onClick={() => onItemClick(component.id, "component")}
          />
        ))}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 left-0 right-0 h-3 resize-handle bg-gradient-to-r from-transparent via-gray-400 to-transparent 
          opacity-30 hover:opacity-100 cursor-row-resize transition-opacity rounded-b-lg"
        onMouseDown={handleMouseDown}
        title="Drag to resize"
      />
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        ↕
      </div>
    </div>
  );
};

export default Column;
