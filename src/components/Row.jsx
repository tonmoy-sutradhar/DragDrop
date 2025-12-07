// import React from "react";
// import { useDroppable } from "@dnd-kit/core";
// import Column from "./Column";

// const Row = ({ row, onItemClick, onResizeColumn }) => {
//   const { setNodeRef, isOver } = useDroppable({
//     id: row.id,
//     data: { type: "row" },
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       className={`bg-gradient-to-r from-gray-50 to-white rounded-lg border ${
//         isOver ? "border-blue-300" : "border-gray-300"
//       }
//         p-4 transition-all`}
//     >
//       <div className="flex items-center justify-between mb-2">
//         <span className="text-sm font-medium text-gray-600 px-2 py-1 bg-gray-100 rounded">
//           Row: {row.id}
//         </span>
//       </div>
//       <div className="flex gap-4 min-h-[100px]">
//         {row.children.map((column) => (
//           <Column
//             key={column.id}
//             column={column}
//             onItemClick={onItemClick}
//             onResizeColumn={onResizeColumn}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Row;

//------------------------------------
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import Column from "./Column";

const Row = ({ row, onItemClick, onResizeColumn }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: row.id,
    data: { type: "row" },
  });

  const handleRowClick = () => {
    onItemClick(row.id, "row");
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleRowClick}
      className={`bg-gradient-to-r from-gray-50 to-white  border ${
        isOver ? "border-blue-300" : "border-red-500"
      } 
        p-4 transition-all cursor-pointer hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 px-2 py-1 bg-gray-100 rounded">
            {row.id}
          </span>
        </div>
        <div className="text-xs text-gray-400">{row.children.length}</div>
      </div>
      <div className="flex gap-4 min-h-[100px] ">
        {row.children.map((column) => (
          <Column
            key={column.id}
            column={column}
            onItemClick={onItemClick}
            onResizeColumn={onResizeColumn}
          />
        ))}
      </div>
    </div>
  );
};

export default Row;
