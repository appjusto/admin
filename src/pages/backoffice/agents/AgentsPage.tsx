import { WithId } from '@appjusto/types';
import { Flex, Text } from '@chakra-ui/react';
import { AgentWithRole } from 'app/api/agent/types';
import { useAgents } from 'app/api/agent/useAgents';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { FieldValue } from 'firebase/firestore';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { AgentBaseDrawer } from '../drawers/agents/AgentBaseDrawer';
import { AgentsTable } from './AgentsTable';

export type AgentRole = 'owner' | 'staff' | 'viewer';
export interface Agent {
  email: string;
  role: AgentRole;
  createdOn: FieldValue;
}

const AgentsPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const { agents } = useAgents();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [agentsList, setAgentsList] = React.useState<WithId<AgentWithRole>[]>();
  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);
  React.useEffect(() => {
    let found = agents;
    if (agents && search.length > 0) {
      found = agents.filter((agent) => agent.email.includes(search));
    }
    setAgentsList(found);
  }, [agents, search]);
  // UI
  return (
    <>
      <PageHeader title={t('Agentes Appjusto')} subtitle={t(`Atualizado ${dateTime}`)} />
      <Flex mt="8">
        <CustomInput
          mt="0"
          minW={{ lg: '260px' }}
          maxW="400px"
          id="search-id"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          label={t('Busca')}
          placeholder={t('Digite o email do agente')}
        />
      </Flex>
      <Flex
        mt="4"
        w="100%"
        pb={{ lg: '2' }}
        justifyContent="flex-end"
        borderBottom="1px solid #C8D7CB"
      ></Flex>
      <Flex
        mt="4"
        flexDir={{ base: 'column', md: 'row' }}
        justifyContent={{ md: 'space-between' }}
        color="black"
      >
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${agentsList?.length ?? '0'} agentes encontrados`)}
        </Text>
        <CustomButton mt="0" label={t('Adicionar agente')} link={`${path}/new`} />
      </Flex>
      <AgentsTable agents={agentsList} />
      <Switch>
        <Route path={`${path}/:agentId`}>
          <AgentBaseDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default AgentsPage;
