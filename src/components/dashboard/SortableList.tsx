"use client";

import { type ReactNode, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/** Derived from useSortable return type to avoid spelling unsafe `Function`. */
type UseSortableReturn = ReturnType<typeof useSortable>;

export type DragHandleProps = {
  ref: UseSortableReturn["setActivatorNodeRef"];
  listeners: UseSortableReturn["listeners"];
  attributes: UseSortableReturn["attributes"];
};

export type MoveActions = {
  onMoveUp: (() => void) | null;
  onMoveDown: (() => void) | null;
};

interface SortableListProps<T extends { id: number }> {
  items: T[];
  onReorder: (reordered: T[]) => void;
  renderItem: (
    item: T,
    dragHandleProps: DragHandleProps,
    moveActions: MoveActions,
  ) => ReactNode;
}

function SortableItem<T extends { id: number }>({
  item,
  renderItem,
  moveActions,
}: {
  item: T;
  renderItem: SortableListProps<T>["renderItem"];
  moveActions: MoveActions;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {renderItem(
        item,
        {
          ref: setActivatorNodeRef,
          listeners,
          attributes,
        },
        moveActions,
      )}
    </div>
  );
}

export function SortableList<T extends { id: number }>({
  items,
  onReorder,
  renderItem,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      onReorder(arrayMove(items, oldIndex, newIndex));
    },
    [items, onReorder],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, index) => (
          <SortableItem
            key={item.id}
            item={item}
            renderItem={renderItem}
            moveActions={{
              onMoveUp:
                index > 0
                  ? () => onReorder(arrayMove([...items], index, index - 1))
                  : null,
              onMoveDown:
                index < items.length - 1
                  ? () => onReorder(arrayMove([...items], index, index + 1))
                  : null,
            }}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
