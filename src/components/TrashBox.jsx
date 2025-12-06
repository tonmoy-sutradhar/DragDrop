import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { FaTrash } from "react-icons/fa";

const TrashBox = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: "trash",
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-6 border-2 ${
        isOver ? "border-red-500 bg-red-50" : "border-gray-300"
      } 
        rounded-xl flex items-center justify-center gap-4 transition-all`}
    >
      <FaTrash
        className={`text-2xl ${isOver ? "text-red-500" : "text-gray-400"}`}
      />
      <span
        className={`text-lg font-medium ${
          isOver ? "text-red-600" : "text-gray-600"
        }`}
      >
        Drag items here to remove
      </span>
    </div>
  );
};

export default TrashBox;
