import { GetManagersPayload, ManagerProfile, NewManagerData, WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { getDoc, setDoc, Unsubscribe, updateDoc } from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import { customDocumentSnapshot } from '../utils';
import { AgentWithRole } from './types';

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

  async getAgents(resultHandler: (result: WithId<AgentWithRole>[]) => void) {
    const payload: GetManagersPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      type: 'agents',
    };
    try {
      const users = (await this.refs.getGetManagersCallable()(payload)) as unknown as {
        data: WithId<AgentWithRole>[];
      };
      resultHandler(users.data);
    } catch (error) {
      //@ts-ignore
      Sentry.captureException(error);
      return null;
    }
  }

  public async createProfile(id: string, email: string) {
    const data = await getDoc(this.refs.getAgentRef(id));
    if (!data.exists()) {
      await setDoc(this.refs.getAgentRef(id), {
        situation: 'pending',
        email,
      } as Partial<ManagerProfile>);
    }
  }

  async updateProfile(id: string, changes: Partial<ManagerProfile>) {
    await updateDoc(this.refs.getAgentRef(id), changes);
  }

  async createAgent(data: { key: string; agent: NewManagerData }) {
    const { key, agent } = data;
    return console.log(data);
    // const payload: CreateManagersPayload = {
    //   meta: { version: '1' }, // TODO: pass correct version on
    //   key,
    //   agent,
    // };
    // const result = await this.refs.getCreateManagersCallable()(payload);
    // return result;
  }
}
