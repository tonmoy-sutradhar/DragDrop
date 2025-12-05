import React, { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Sidebar from "./components/Sidebar";
import GridContainer from "./components/GridContainer";
// import TrashBox from "./components/TrashBox";
// import ComponentItem from "./components/ComponentItem";
import Modal from "./components/Modal";
import "./App.css";
import TrashBox from "./components/TrashBox";

const initialLayout = [
  {
    type: "ROW",
    id: "row0",
    children: [
      {
        type: "COLUMN",
        id: "column0",
        height: 200,
        children: [
          {
            type: "COMPONENT",
            id: "component0",
            itemType: "input",
            content: "Some input",
          },
          {
            type: "COMPONENT",
            id: "component1",
            itemType: "image",
            content: "Some image",
          },
        ],
      },
    ],
  },
  {
    type: "ROW",
    id: "row1",
    children: [
      {
        type: "COLUMN",
        id: "column1",
        height: 200,
        children: [],
      },
      {
        type: "COLUMN",
        id: "column2",
        height: 200,
        children: [],
      },
    ],
  },
];

const sidebarItems = [
  { id: "sidebar-input", type: "input", label: "Input", icon: "📝" },
  { id: "sidebar-name", type: "name", label: "Name", icon: "👤" },
  { id: "sidebar-email", type: "email", label: "Email", icon: "📧" },
  { id: "sidebar-phone", type: "phone", label: "Phone", icon: "📱" },
  { id: "sidebar-image", type: "image", label: "Image", icon: "🖼️" },
  { id: "sidebar-row", type: "row", label: "Row", icon: "📏" },
  { id: "sidebar-column", type: "column", label: "Column", icon: "📐" },
];

function App() {
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <Sidebar items={sidebarItems} />

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Drag & Drop Grid Layout
              </h1>
              <GridContainer
                layout={layout}
                onItemClick={handleItemClick}
                onResizeColumn={handleResizeColumn}
              />
            </div>

            {/* Trash Box */}
            {/* <TrashBox /> */}
            <TrashBox></TrashBox>

            {/* JSON Data Display */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Layout JSON Data
              </h3>
              <textarea
                readOnly
                value={JSON.stringify(layout, null, 2)}
                className="w-full h-64 font-mono text-sm p-4 bg-gray-50 rounded-lg border border-gray-200"
              />
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {draggedItem && (
          <div className="p-3 bg-blue-100 rounded-lg border border-blue-300 shadow-lg opacity-80">
            {draggedItem.type}
          </div>
        )}
      </DragOverlay>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Item Details"
      >
        <div className="p-4">
          <p className="text-lg font-medium text-gray-700">
            Item ID:{" "}
            <span className="font-mono text-blue-600">{selectedItemId}</span>
          </p>
        </div>
      </Modal>
    </DndContext>
  );
}

export default App;
////

// import "./App.css";

// function App() {
//   return <div className="text-3xl font-bold text-red-600">Tonmoy</div>;
// }

// export default App;
