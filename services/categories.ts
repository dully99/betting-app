import { api } from './api';

export interface CategoryDTO {
  id: number;
  name: string;
  type: 'FREE' | 'VIP';
}

export const categoriesService = {
  getAllCategories: () => api.get<CategoryDTO[]>('/categories').then((r) => r.data),
};
