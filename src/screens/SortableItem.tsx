// src/components/SortableItem.tsx

import React from 'react';
import { Card, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CardType {
  id: number;
  contactId: number;
  name: string;
  phone: string;
  email: string;
  lastContact: string;
  labels: string[];
  columnId: number;
}

interface SortableItemProps {
  id: number;
  card: CardType;
  columnId: number;
  openEditCardPanel: (card: CardType, columnId: number) => void;
  handleDeleteCard: (cardId: number) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  card,
  columnId,
  openEditCardPanel,
  handleDeleteCard,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="mb-4 cursor-move"
      onClick={() => openEditCardPanel(card, columnId)}
      {...attributes}
      {...listeners}
    >
      <h3 className="font-bold">{card.name}</h3>
      <p className="text-gray-500">Último contato: {new Date(card.lastContact).toLocaleDateString()}</p>
      <p className="text-gray-500">Telefone: {card.phone}</p>
      <p className="text-gray-500">Email: {card.email}</p>
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }}
      >
        Excluir
      </Button>
    </Card>
  );
};

export default SortableItem;
