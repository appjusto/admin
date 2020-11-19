import firebase from 'firebase/app';
import { WithId, Category, Product } from 'appjusto-types';
import { documentAs } from '../utils';

type ObserveCategoriesOptions = {
  restaurantId: string;
};

export default class MenuApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // private
  // helpers
  private getMenuRef() {
    return this.firestore.collection('business').doc('menu');
  }
  private getCategoriesRef() {
    return this.getMenuRef().collection('categories');
  }
  private getProductsRef() {
    return this.getMenuRef().collection('products');
  }

  // public
  // firestore
  observeCategories(
    options: ObserveCategoriesOptions,
    resultHandler: (orders: WithId<Category>[]) => void
  ): firebase.Unsubscribe {
    const { restaurantId } = options;
    let query = this.getCategoriesRef()
      .orderBy('name', 'asc')
      .where('restaurantId', '==', restaurantId);

    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentAs<Category>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async addCategory(category: Category) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.getCategoriesRef().add({
      ...category,
      timestamp,
    });
  }

  async addProduct(product: Product) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.getProductsRef().add({
      ...product,
      timestamp,
    });
  }

  async fetchProducts(categoryId: string) {
    return documentAs<Product>(
      (await this.getProductsRef().where('categoryId', '==', categoryId).get()).docs
    );
  }
}
