import axios from 'axios';
import SessionService from "./SessionService";

const API_URL = process.env.REACT_APP_API_URL; // Adicionando a variável de ambiente

export interface Webhook {
  id: number; // Alterado para number
  name: string;
  callbackUrl: string;
  isEditing: any;
  sectorId?: number; // Manter como opcional
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookRequestDTO {
  name: string;
  callbackUrl: string;
  sectorId?: number; // Manter como opcional
}

export interface UpdateWebhookRequestDTO {
  name: string;
  callbackUrl: string;
  sectorId?: number; // Manter como opcional
}

export const createWebhook = async (webhookData: CreateWebhookRequestDTO) => {
  try {
    const response = await axios.post(`${API_URL}/webhooks`, webhookData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create webhook: ${error}`);
  }
};

export const updateWebhook = async (id: number, data: UpdateWebhookRequestDTO) => {
  try {
    const response = await axios.put(`${API_URL}/webhooks/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update webhook: ${error}`);
  }
};

export const getWebhook = async (id: number): Promise<Webhook> => {
  try {
    const response = await axios.get(`${API_URL}/webhooks/${id}`, {
      headers: {
        'Accept': '*/*',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get webhook with id ${id}: ${error}`);
  }
};

export const getWebhooks = async (): Promise<Webhook[]> => {
  try {
    const sectorId = SessionService.getSessionForSector();
    const response = await axios.get(`${API_URL}/webhooks?sectorId=${sectorId}`, {
      headers: {
        'Accept': '*/*',
      },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

export const deleteWebhook = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/webhooks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete webhook with id ${id}: ${error}`);
  }
};
