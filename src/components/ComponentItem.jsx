import { useDraggable } from "@dnd-kit/core";

const ComponentItem = ({ component, onClick }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: component.id,
    data: { type: component.itemType },
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`p-2  
    border-2 border-gray-500 border-dotted 
    bg-white
    ${isDragging ? "opacity-50" : ""}
  `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h4 className="font-medium text-gray-800 capitalize">
              {component.itemType}
            </h4>
            <p className="text-sm text-gray-600">{component.content}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded mb-1">
            {component.id}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComponentItem;
