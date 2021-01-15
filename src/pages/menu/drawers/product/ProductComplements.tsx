import { Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { StateProps } from './productReducer';

interface ProductComplementsProps {
  state: StateProps;
  handleStateUpdate(key: string, value: string | number | React.ReactText[] | boolean): void;
}

export const ProductComplements = ({ state, handleStateUpdate }: ProductComplementsProps) => {
  const {
    name,
    categoryId,
    description,
    price,
    pdvCod,
    classifications,
    imageUrl,
    previewURL,
    enabled,
  } = state;
  return (
    <>
      <Text fontSize="20px" color="black">
        {t('Esse item possui complementos?')}
      </Text>
      <RadioGroup
        //onChange={setValue}
        //value={value}
        defaultValue="1"
        colorScheme="green"
        color="black"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="1">
            {t('Não possui')}
          </Radio>
          <Radio mt="2" value="2">
            {t('Sim, possui complementos')}
          </Radio>
        </Flex>
      </RadioGroup>
    </>
  );
};
