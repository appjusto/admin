import { TaskDocument } from '@appjusto/types';
import { documentAs } from 'core/fb';
import { FirebaseError } from 'firebase/app';
import { getDocs, query, where } from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';

export type WithAuthId<T extends object> = T & {
  authId: string | null;
};

export default class TasksApi {
  constructor(private refs: FirebaseRefs) {}
  // firestore
  async getOrderTaskByType(orderId: string, type: string) {
    const q = query(
      this.refs.getTasksRef(), 
      where('extra.orderId', '==', orderId),
      where('extra.type', '==', type)
    );
    const task = await getDocs(q).then((snapshot) => {
      if (!snapshot.empty) return documentAs<TaskDocument>(snapshot.docs[0]);
      else throw new FirebaseError(
        'ignored-error', 
        'Não foi possível encontrar a tarefa.'
      );
    });
    return task;
  }
}
