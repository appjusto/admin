import { Category, Product, WithId } from 'appjusto-types';

export interface CategoryWithProducts extends WithId<Category> {
  products: WithId<Product>[];
}
