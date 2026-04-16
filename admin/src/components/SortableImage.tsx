import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { XIcon } from "lucide-react";
import type { ImageItem } from "@shared/product.types";

export const SortableImage = ({
  item,
  index,
  handleRemoveImage,
}: {
  item: ImageItem;
  index: number;
  handleRemoveImage: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="avatar relative touch-none group"
      {...attributes}
      {...listeners}
    >
      <div className="w-20 rounded-lg mr-2 ring-1 ring-base-300 shadow-sm overflow-hidden bg-base-100">
        <img
          src={item.url}
          alt={`Preview ${index + 1}`}
          draggable={false}
          className="object-cover w-full h-full"
        />
      </div>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking remove
        onClick={() => handleRemoveImage(item.id)}
        className="absolute top-1 right-1 bg-error text-error-content rounded-full p-1 cursor-pointer hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 z-10"
      >
        <XIcon className="size-3" />
      </button>
    </div>
  );
}