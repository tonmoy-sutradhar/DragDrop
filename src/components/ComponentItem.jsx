// import React from "react";
// import { useDraggable } from "@dnd-kit/core";

// const ComponentItem = ({ component, onClick }) => {
//   const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
//     id: component.id,
//     data: { type: component.itemType },
//   });

//   const getIcon = (type) => {
//     switch (type) {
//       case "input":
//         return "📝";
//       case "name":
//         return "👤";
//       case "email":
//         return "📧";
//       case "phone":
//         return "📱";
//       case "image":
//         return "🖼️";
//       default:
//         return "📦";
//     }
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       {...attributes}
//       {...listeners}
//       onClick={onClick}
//       className={`p-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg border border-blue-200
//         cursor-move transition-all hover:shadow-md ${
//           isDragging ? "opacity-50" : ""
//         }`}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg">
//             {getIcon(component.itemType)}
//           </div>
//           <div>
//             <h4 className="font-medium text-gray-800 capitalize">
//               {component.itemType}
//             </h4>
//             <p className="text-sm text-gray-600">{component.content}</p>
//           </div>
//         </div>
//         <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
//           {component.id.split("-")[0]}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default ComponentItem;

//---------------------------------------
import React from "react";
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
