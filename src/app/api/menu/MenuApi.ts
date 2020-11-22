import firebase from 'firebase/app';
import { WithId, Category, Product } from 'appjusto-types';
import { documentAs } from '../utils';
import { MenuConfig } from 'appjusto-types/menu';

export default class MenuApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // private
  // helpers
  private getBusinessRef(businessId: string) {
    return this.firestore.collection('business').doc(businessId);
  }
  private getMenuConfigRef(businessId: string) {
    return this.getBusinessRef(businessId).collection('config').doc('menu');
  }
  private getCategoriesRef(businessId: string) {
    return this.getBusinessRef(businessId).collection('categories');
  }
  private getProductsRef(businessId: string) {
    return this.getBusinessRef(businessId).collection('products');
  }

  // public
  // firestore
  // menu
  observeMenuConfig(
    businessId: string,
    resultHandler: (orders: MenuConfig) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.getMenuConfigRef(businessId).onSnapshot(
      (doc) => {
        resultHandler({ ...(doc.data() as MenuConfig) });
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  async updateMenuConfig(businessId: string, menuConfig: MenuConfig) {
    await this.getMenuConfigRef(businessId).update(menuConfig);
  }

  // categories
  observeCategories(
    businessId: string,
    resultHandler: (orders: WithId<Category>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.getCategoriesRef(businessId).onSnapshot(
      (querySnapshot) => {
        resultHandler(documentAs<Category>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  async addCategory(businessId: string, category: Category) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const doc = await this.getCategoriesRef(businessId).add({
      ...category,
      timestamp,
    });
    const menuConfigRef = this.getMenuConfigRef(businessId);
    const menuConfigSnapshot = await menuConfigRef.get();
    const menuConfig = menuConfigSnapshot.data() as MenuConfig;
    const categoriesOrder = (menuConfig?.categoriesOrder ?? []).concat(doc.id);
    await menuConfigRef.set(
      {
        categoriesOrder,
      } as Partial<MenuConfig>,
      { merge: true }
    );
    return doc;
  }

  // products
  observeProducts(
    businessId: string,
    resultHandler: (orders: WithId<Product>[]) => void
  ): firebase.Unsubscribe {
    const query = this.getProductsRef(businessId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentAs<Product>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  async addProduct(businessId: string, product: Product, categoryId: string) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const doc = await this.getProductsRef(businessId).add({
      ...product,
      timestamp,
    });
    const menuConfigRef = this.getMenuConfigRef(businessId);
    const menuConfigSnapshot = await menuConfigRef.get();
    const menuConfig = menuConfigSnapshot.data() as MenuConfig;
    const productsOrder = (menuConfig.productsOrderByCategoryId[categoryId] ?? []).concat(doc.id);
    await menuConfigRef.set(
      {
        productsOrderByCategoryId: {
          ...menuConfig.productsOrderByCategoryId,
          [categoryId]: productsOrder,
        },
      } as Partial<MenuConfig>,
      { merge: true }
    );

    return doc;
  }
}
