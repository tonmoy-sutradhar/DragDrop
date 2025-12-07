import React, { useState, useCallback, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import GridContainer from "./components/GridContainer";
import Modal from "./components/Modal";
import "./App.css";
import TrashBox from "./components/TrashBox";
import SidebarItem from "./components/Sidebar";

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
  const [layout, setLayout] = useState(initialLayout);
  const [activeId, setActiveId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  // Use refs to maintain counters across renders
  const rowCounter = useRef(2); // Starting from 2 because we already have row0 and row1
  const columnCounter = useRef(3); // Starting from 3 because we already have column0, column1, column2
  const componentCounter = useRef(2); // Starting from 2 because we already have component0 and component1

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Function to generate readable IDs with sequential numbers
  const generateReadableId = (type) => {
    switch (type) {
      case "row":
        const rowId = `row${rowCounter.current}`;
        rowCounter.current += 1;
        return rowId;
      case "column":
        const columnId = `column${columnCounter.current}`;
        columnCounter.current += 1;
        return columnId;
      case "component":
        const componentId = `component${componentCounter.current}`;
        componentCounter.current += 1;
        return componentId;
      default:
        return `${type}${componentCounter.current}`;
    }
  };

  // Function to get next available number for each type based on existing layout
  const getNextAvailableNumber = (type, currentLayout) => {
    const allIds = [];

    const collectIds = (items) => {
      items.forEach((item) => {
        if (item.id && item.id.startsWith(type)) {
          const match = item.id.match(new RegExp(`${type}(\\d+)`));
          if (match) {
            allIds.push(parseInt(match[1]));
          }
        }
        if (item.children) {
          collectIds(item.children);
        }
      });
    };

    collectIds(currentLayout);

    if (allIds.length === 0) return 0;

    // Find the highest number and increment by 1
    const maxNumber = Math.max(...allIds);
    return maxNumber + 1;
  };

  // Alternative function that doesn't use refs, checks existing layout instead
  const generateId = (type) => {
    let counter = 0;

    switch (type) {
      case "row":
        counter = getNextAvailableNumber("row", layout);
        return `row${counter}`;
      case "column":
        counter = getNextAvailableNumber("column", layout);
        return `column${counter}`;
      case "component":
        counter = getNextAvailableNumber("component", layout);
        return `component${counter}`;
      default:
        counter = getNextAvailableNumber(type, layout);
        return `${type}${counter}`;
    }
  };

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);

    const active = event.active;
    const sidebarItem = sidebarItems.find((item) => item.id === active.id);
    if (sidebarItem) {
      setDraggedItem({
        type: sidebarItem.type,
        fromSidebar: true,
        data: sidebarItem,
      });
    } else {
      setDraggedItem({
        type: "component",
        fromSidebar: false,
        data: active,
      });
    }
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      setActiveId(null);
      setDraggedItem(null);

      if (!over) return;

      // Handle dropping into trash
      if (over.id === "trash") {
        setLayout((prev) => removeItemFromLayout(prev, active.id));
        return;
      }

      // Handle dropping from sidebar
      if (active.id.startsWith("sidebar-")) {
        const itemType = active.id.replace("sidebar-", "");

        if (itemType === "row") {
          // Add new row
          const newRow = {
            type: "ROW",
            id: generateId("row"),
            children: [],
          };

          // Find drop position
          if (over.id.startsWith("row")) {
            const rowIndex = layout.findIndex((row) => row.id === over.id);
            const newLayout = [...layout];
            newLayout.splice(rowIndex + 1, 0, newRow);
            setLayout(newLayout);
          } else {
            setLayout([...layout, newRow]);
          }
        } else if (itemType === "column") {
          // Add new column
          const newColumn = {
            type: "COLUMN",
            id: generateId("column"),
            height: 200,
            children: [],
          };

          // Find target row
          const targetRow = findRow(layout, over.id);
          if (targetRow) {
            const newLayout = JSON.parse(JSON.stringify(layout));
            const row = findRowInLayout(newLayout, targetRow.id);
            if (row) {
              row.children.push(newColumn);
              setLayout(newLayout);
            }
          }
        } else {
          // Add new component
          const newComponent = {
            type: "COMPONENT",
            id: generateId("component"),
            itemType,
            content: `Some ${itemType}`,
          };

          // Find target column
          const targetColumn = findColumn(layout, over.id);
          if (targetColumn) {
            const newLayout = JSON.parse(JSON.stringify(layout));
            const column = findColumnInLayout(newLayout, targetColumn.id);
            if (column) {
              column.children.push(newComponent);
              setLayout(newLayout);
            }
          }
        }
      }
      // Handle reordering within grid
      else if (
        over.id.startsWith("column") &&
        active.id.startsWith("component")
      ) {
        const newLayout = JSON.parse(JSON.stringify(layout));
        const sourceColumn = findColumnContainingComponent(
          newLayout,
          active.id
        );
        const targetColumn = findColumnInLayout(newLayout, over.id);

        if (sourceColumn && targetColumn) {
          const componentIndex = sourceColumn.children.findIndex(
            (c) => c.id === active.id
          );
          const [component] = sourceColumn.children.splice(componentIndex, 1);
          targetColumn.children.push(component);
          setLayout(newLayout);
        }
      }
    },
    [layout]
  );

  const removeItemFromLayout = (currentLayout, itemId) => {
    const newLayout = JSON.parse(JSON.stringify(currentLayout));

    const removeRecursive = (items) => {
      const filtered = items.filter((item) => item.id !== itemId);

      for (let item of filtered) {
        if (item.children) {
          item.children = removeRecursive(item.children);
        }
      }

      return filtered;
    };

    return removeRecursive(newLayout);
  };

  const findRow = (layout, id) => {
    for (let row of layout) {
      if (row.id === id) return row;
      if (row.children) {
        const found = findRow(row.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findColumn = (layout, id) => {
    for (let row of layout) {
      for (let col of row.children) {
        if (col.id === id) return col;
        if (col.children) {
          const found = findColumn(col.children, id);
          if (found) return found;
        }
      }
    }
    return null;
  };

  const findRowInLayout = (layout, rowId) => {
    return layout.find((row) => row.id === rowId);
  };

  const findColumnInLayout = (layout, columnId) => {
    for (let row of layout) {
      const column = row.children.find((col) => col.id === columnId);
      if (column) return column;
    }
    return null;
  };

  const findColumnContainingComponent = (layout, componentId) => {
    for (let row of layout) {
      for (let column of row.children) {
        const component = column.children.find((c) => c.id === componentId);
        if (component) return column;
      }
    }
    return null;
  };

  // Find any item in layout by id
  const findItemById = (layout, itemId) => {
    for (let item of layout) {
      if (item.id === itemId) return item;
      if (item.children) {
        const found = findItemById(item.children, itemId);
        if (found) return found;
      }
    }
    return null;
  };

  const handleItemClick = (itemId, itemType = "component") => {
    const item = findItemById(layout, itemId);
    setSelectedItem({
      id: itemId,
      type: itemType,
      data: item,
    });
    setIsModalOpen(true);
  };

  const handleResizeColumn = (columnId, newHeight) => {
    const newLayout = JSON.parse(JSON.stringify(layout));
    const column = findColumnInLayout(newLayout, columnId);
    if (column) {
      column.height = Math.max(100, newHeight);
      setLayout(newLayout);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Format layout data as shown in PDF example
  const formatLayoutData = () => {
    const formatItem = (item) => {
      if (item.type === "ROW") {
        return {
          type: "ROW",
          id: item.id,
          children: item.children.map(formatItem),
        };
      } else if (item.type === "COLUMN") {
        return {
          type: "COLUMN",
          id: item.id,
          children: item.children.map(formatItem),
        };
      } else if (item.type === "COMPONENT") {
        return {
          type: "COMPONENT",
          id: item.id,
        };
      }
      return item;
    };

    return {
      layout: layout.map(formatItem),
    };
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <SidebarItem items={sidebarItems} />

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white border-2 border-gray-500  shadow-lg p-4 md:p-6 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Drag & Drop Grid Layout
              </h1>
              <GridContainer
                layout={layout}
                onItemClick={handleItemClick}
                onResizeColumn={handleResizeColumn}
              />
            </div>

            <div className="w-full flex justify-center mt-6">
              <TrashBox></TrashBox>
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
          <p className="text-lg font-medium text-gray-700 mb-2">
            Item ID:{" "}
            <span className="font-mono text-blue-600">{selectedItem?.id}</span>
          </p>
          <p className="text-md text-gray-600">
            Type:{" "}
            <span className="font-medium capitalize">{selectedItem?.type}</span>
          </p>
          {selectedItem?.data && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Item Data:
              </p>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(selectedItem.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </Modal>
    </DndContext>
  );
}

export default App;
