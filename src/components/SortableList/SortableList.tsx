import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';

interface SortableListProps<T> {
    items: T[];
    itemKey: (item: T) => string;
    renderItem: (item: T) => React.ReactNode;
    onReorder: (reorderedItems: T[]) => void;
    droppableId: string;
    className?: string;
}

function SortableList<T>({
    items,
    itemKey,
    renderItem,
    onReorder,
    droppableId,
    className = ''
}: SortableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Distancia en píxeles que el puntero debe moverse antes de que se active el arrastre
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => itemKey(item) === active.id);
            const newIndex = items.findIndex(item => itemKey(item) === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            onReorder(newItems);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(item => itemKey(item))}
                strategy={verticalListSortingStrategy}
            >
                <div className={className}>
                    {items.map((item) => renderItem(item))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

export default SortableList; 