import React from "react";
import { useDroppable } from "@dnd-kit/core";
import Row from "./Row";

const GridContainer = ({ layout, onItemClick, onResizeColumn }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "grid-container",
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[500px] border-2 ${
        isOver ? "border-blue-400 border-dashed bg-blue-50" : "border-gray-200"
      } 
        rounded-lg p-4 transition-all duration-200`}
    >
      {layout.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-lg">Drop components here to build your layout</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {layout.map((row) => (
            <Row
              key={row.id}
              row={row}
              onItemClick={onItemClick}
              onResizeColumn={onResizeColumn}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GridContainer;
