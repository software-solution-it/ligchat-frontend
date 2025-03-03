import axios from 'axios';
import SessionService from './SessionService';

const API_URL = process.env.REACT_APP_API_URL; // Adicionando a variável de ambiente

export interface Column {
  id: number;
  name: string;
  sectorId: number;
}

interface CreateColumnRequestDTO {
  name: string;
  sectorId: number;
  position: number; // Nova propriedade
}

interface UpdateColumnRequestDTO {
  name?: string;
  position?: number; // Nova propriedade opcional
}


// Função para criar uma nova coluna
export const createColumn = async (columnData: CreateColumnRequestDTO) => {
  try {
    const response = await axios.post(`${API_URL}/colunas`, columnData); // Atualizando o endpoint
    return response.data;
  } catch (error) {
    throw new Error(`Falha ao criar coluna: ${error}`);
  }
};


// Função para atualizar uma coluna existente
export const updateColumn = async (id: number, data: UpdateColumnRequestDTO) => {
  try {
    const response = await axios.put(`${API_URL}/colunas/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Falha ao atualizar coluna com id ${id}: ${error}`);
  }
};

// Função para obter uma coluna específica pelo ID
export const getColumn = async (id: number): Promise<Column> => {
  try {
    const response = await axios.get(`${API_URL}/colunas/${id}`, {
      headers: {
        'Accept': '*/*',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Falha ao obter coluna com id ${id}: ${error}`);
  }
};

// Função para obter todas as colunas
export const getColumns = async (): Promise<any> => {
  try {
    const sectorId = SessionService.getSession('selectedSector')
    const response = await axios.get(`${API_URL}/colunas?sectorId=${sectorId}`, {
      headers: {
        'Accept': '*/*',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Falha ao obter colunas: ' + error);
  }
};

// Função para deletar uma coluna pelo ID
export const deleteColumn = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/colunas/${id}`); // Atualizando o endpoint
    return response.data;
  } catch (error) {
    throw new Error(`Falha ao excluir coluna com id ${id}: ${error}`);
  }
};


export const moveColumn = async (id: number, newPosition: number) => {
  try {
    const response = await axios.put(`${API_URL}/colunas/${id}/move`, { newPosition: newPosition }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Falha ao mover a coluna com id ${id} para a posição ${newPosition}: ${error}`);
  }
};
  
