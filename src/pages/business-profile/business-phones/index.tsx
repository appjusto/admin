import { BusinessPhone } from '@appjusto/types';
import { Box, Button, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { t } from 'utils/i18n';
import { BusinessPhoneItem } from './BusinessPhoneItem';

export type BusinessPhoneField = 'type' | 'number' | 'calls' | 'whatsapp';

interface BusinessPhonesProps {
  phones: BusinessPhone[];
  addPhone(): void;
  removePhone(index: number): void;
  handlePhoneUpdate(index: number, field: BusinessPhoneField, value: any): void;
  handleOrdering?(newPhones: BusinessPhone[]): void;
  isBackoffice?: boolean;
  isOnboarding?: boolean;
}

export const BusinessPhones = ({
  phones,
  addPhone,
  removePhone,
  handlePhoneUpdate,
  handleOrdering,
  isBackoffice = false,
  isOnboarding = false,
}: BusinessPhonesProps) => {
  // context
  const { userAbility } = useContextFirebaseUser();
  // helpers
  const userCanUpdate =
    userAbility?.can('update', 'businesses') || isOnboarding;
  // handlers
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!handleOrdering) return;
    if (!destination) return; // dropped outside
    if (source.index === destination.index) return;
    // same location
    else {
      // update ordering
      let newArray = [] as BusinessPhone[];
      phones.forEach((phone, index) => {
        if (index === source.index) {
          // do nothing
        } else if (index === destination.index) {
          if (source.index > destination.index)
            newArray.push(phones[source.index], phone);
          else newArray.push(phone, phones[source.index]);
        } else newArray.push(phone);
      });
      handleOrdering(newArray);
    }
  };
  // UI
  if (isBackoffice) {
    return (
      <Box mt="8">
        <Text fontSize="xl" color="black">
          {t('Telefones de contato:')}
        </Text>
        {phones.length > 0 ? (
          <>
            <Text my="2" fontSize="md">
              {t(
                'A ordenação dos telefones deve seguir o critério de maior efetividade de contato.'
              )}
            </Text>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="phones">
                {(droppable, snapshot) => (
                  <Box
                    ref={droppable.innerRef}
                    {...droppable.droppableProps}
                    bg={snapshot.isDraggingOver ? 'gray.50' : 'white'}
                    minH={100}
                    w="100%"
                    overflow="auto"
                  >
                    {phones.map((phone, index) => (
                      <BusinessPhoneItem
                        key={index}
                        index={index}
                        phone={phone}
                        isRemoving={phones.length > 1}
                        handlePhoneUpdate={handlePhoneUpdate}
                        removePhone={removePhone}
                        isBackoffice
                      />
                    ))}
                    {droppable.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </>
        ) : (
          <Text my="2" fontSize="sm" color="black">
            {t('Nenhum telefone informado.')}
          </Text>
        )}
        <Button
          display={userCanUpdate ? 'inline-block' : 'none'}
          mt="4"
          variant="secondary"
          size="sm"
          onClick={addPhone}
        >
          {t('Adicionar telefone')}
        </Button>
      </Box>
    );
  }
  return (
    <Box mt="8">
      <Text fontSize="xl" color="black">
        {t('Telefones de contato:')}
      </Text>
      <Text mt="2" fontSize="md">
        {t(
          'Para melhorar a experiência de atendimento com nosso suporte, é importante informar os telefones ativos para tratar sobre pedidos'
        )}
      </Text>
      {phones.map((phone, index) => (
        <BusinessPhoneItem
          key={index}
          index={index}
          phone={phone}
          isRemoving={phones.length > 1}
          handlePhoneUpdate={handlePhoneUpdate}
          removePhone={removePhone}
        />
      ))}
      <Button
        display={userCanUpdate ? 'inline-block' : 'none'}
        mt="4"
        variant="secondary"
        size="sm"
        onClick={addPhone}
      >
        {t('Adicionar telefone')}
      </Button>
    </Box>
  );
};
