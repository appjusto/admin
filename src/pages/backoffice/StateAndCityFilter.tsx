import { Box, HStack } from '@chakra-ui/react';
import { Select } from 'common/components/form/select/Select';
import React from 'react';
import { t } from 'utils/i18n';
import ufs from '../../utils/ufs';

const IBGEUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

interface StateAndCityFilterProps {
  state: string;
  city: string;
  handleStateChange(state: string): void;
  handleCityChange(city: string): void;
  isRequired?: boolean;
}

type City = {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        sigla: string;
        nome: string;
        regiao: {
          id: number;
          sigla: string;
          nome: string;
        };
      };
    };
  };
};

export const StateAndCityFilter = ({
  state,
  city,
  handleStateChange,
  handleCityChange,
  isRequired,
}: StateAndCityFilterProps) => {
  // state
  const [citiesList, setCitiesList] = React.useState<string[]>([]);

  // helpers
  let cityPlaceholder = 'Selecione um estado';
  if (state !== '') {
    if (citiesList.length === 0) cityPlaceholder = 'Carregando...';
    else cityPlaceholder = 'Selecione uma cidade';
  }

  // side effects
  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${IBGEUrl}/${state}/municipios`);
        const cities = await response.json();
        const list = cities.map((city: City) => city.nome);
        setCitiesList(list);
      } catch (error) {
        console.log('fetchCitiesError', error);
      }
    })();
  }, [state]);

  // UI
  return (
    <Box w="100%">
      <HStack spacing={2}>
        <Select
          mt="0"
          maxW="110px"
          label={t('UF')}
          placeholder={t('Estado')}
          value={state}
          onChange={(e) => handleStateChange(e.target.value)}
          isRequired={isRequired}
        >
          {ufs?.map((uf) => (
            <option key={uf.id} value={uf.sigla}>
              {uf.sigla}
            </option>
          ))}
        </Select>
        <Select
          mt="0"
          isDisabled={state === ''}
          w="100%"
          label={t('Cidade')}
          placeholder={t(cityPlaceholder)}
          value={city}
          onChange={(e) => handleCityChange(e.target.value)}
          isRequired={isRequired}
        >
          {citiesList?.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </HStack>
    </Box>
  );
};
