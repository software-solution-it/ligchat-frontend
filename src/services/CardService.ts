import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export interface Card {
  id: number;
  contactId: number;
  tagId?: number;
  columnId: number;
  lastContact: Date | null;
  sectorId: number;
  position: number;
  contato: Contact;
}

export interface CreateCardRequestDTO {
  contactId: number;
  tagId?: number;
  columnId: number;
  lastContact: Date | null;
  sectorId: number;
  position: number;
}

export interface UpdateCardRequestDTO {
  contactId: number;
  tagId?: number;
  columnId: number;
  lastContact: Date | null;
  sectorId: number;
  position: number;
}

export const createCard = async (cardData: CreateCardRequestDTO) => {
  try {
    const response = await axios.post(`${API_URL}/cards`, cardData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create card: ${error}`);
  }
};

export const updateCard = async (id: number, data: UpdateCardRequestDTO) => {
  try {
    const response = await axios.put(`${API_URL}/cards/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update card: ${error}`);
  }
};

export const getCard = async (id: number): Promise<Card> => {
  try {
    const response = await axios.get(`${API_URL}/cards/${id}`, {
      headers: {
        'Accept': '*/*',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get card with id ${id}: ${error}`);
  }
};

export const getCards = async (): Promise<Card[]> => {
  try {
    const response = await axios.get(`${API_URL}/cards`, {
      headers: {
        'Accept': '*/*',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to get cards: ' + error);
  }
};

export const deleteCard = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/cards/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete card with id ${id}: ${error}`);
  }
};

// Atualização da função moveCard para aceitar newPosition
export const moveCard = async (id: number, newColumnId: number, newPosition: number) => {
  try {
    const response = await axios.put(`${API_URL}/cards/${id}/move`, { newColumnId, newPosition }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to move card with id ${id} to column with id ${newColumnId}: ${error}`);
  }
};
