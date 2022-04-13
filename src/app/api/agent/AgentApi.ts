import {
  BackofficeAccess,
  CreateManagersPayload,
  GetManagersPayload,
  ManagerProfile,
  NewAgentData,
  WithId,
} from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { orderBy, query, Unsubscribe, updateDoc } from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';

export default class AgentApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeProfile(
    id: string,
    resultHandler: (profile: WithId<ManagerProfile> | null) => void
  ): Unsubscribe {
    const ref = this.refs.getAgentRef(id);
    // returns the unsubscribe function
    return customDocumentSnapshot(ref, resultHandler);
  }

  observeAgents(resultHandler: (agents: WithId<ManagerProfile>[] | null) => void): Unsubscribe {
    const q = query(this.refs.getAgentsRef(), orderBy('email'));
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler, {
      avoidPenddingWrites: false,
      captureException: true,
    });
  }

  async getAgent(agentId: string) {
    const payload: GetManagersPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      type: 'agents',
      agentId,
    };
    try {
      const result = await this.refs.getGetManagersCallable()(payload);
      const data = result.data as {
        agent: WithId<ManagerProfile>;
        access: BackofficeAccess;
      };
      return data;
    } catch (error) {
      //@ts-ignore
      Sentry.captureException(error);
      return null;
    }
  }

  // public async createProfile(id: string, email: string) {
  //   const data = await getDoc(this.refs.getAgentRef(id));
  //   if (!data.exists()) {
  //     await setDoc(this.refs.getAgentRef(id), {
  //       situation: 'pending',
  //       email,
  //     } as Partial<ManagerProfile>);
  //   }
  // }

  async updateProfile(id: string, changes: Partial<ManagerProfile>) {
    await updateDoc(this.refs.getAgentRef(id), changes);
  }

  async createAgent(agent: NewAgentData) {
    const payload: CreateManagersPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      type: 'agents',
      agent,
    };
    const result = await this.refs.getCreateManagersCallable()(payload);
    return result;
  }
}
