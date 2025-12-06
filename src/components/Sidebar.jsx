import React from "react";
import { useDraggable } from "@dnd-kit/core";

const Sidebar = ({ items }) => {
  return (
    <div className="w-full lg:w-64 bg-white rounded-xl shadow-lg p-4 md:p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Components</h2>
      <p className="text-sm text-gray-600 mb-6">Drag items to the grid</p>

      <div className="space-y-3">
        {items.map((item) => (
          <DraggableItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const DraggableItem = ({ item }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: { type: item.type, fromSidebar: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 
        cursor-move transition-all hover:shadow-md ${
          isDragging ? "opacity-50" : ""
        }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
          {item.icon}
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{item.label}</h4>
          <p className="text-xs text-gray-500">Drag to add</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
