import { Box, CheckboxGroup, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { CourierReview, CourierReviewType } from 'app/api/courier/CourierApi';
import { useObserveCourierReviews } from 'app/api/courier/useObserveCourierReviews';
import { useContextCourierProfile } from 'app/state/courier/context';
import { WithId } from 'appjusto-types';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import React from 'react';
import { MdThumbDownOffAlt, MdThumbUpOffAlt } from 'react-icons/md';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface ItemPros {
  review: WithId<CourierReview>;
}

const CourierReviewsItem = ({ review }: ItemPros) => {
  // UI
  return (
    <Box mt="4" p="4" bgColor="#F6F6F6" borderRadius="16px">
      <Flex justifyContent="space-between">
        <HStack spacing={4}>
          <Icon
            as={review.type === 'positive' ? MdThumbUpOffAlt : MdThumbDownOffAlt}
            color={review.type === 'positive' ? 'green.600' : 'red'}
            w="24px"
            h="24px"
          />
          <Text fontSize="15px" lineHeight="21px" fontWeight="700">
            {t('Pedido:')}{' '}
            <Text as="span" fontWeight="500">
              {review.orderId ?? 'N/E'}
            </Text>
          </Text>
        </HStack>
        <Text fontSize="13px" lineHeight="21px" fontWeight="500">
          {review.createdOn ? getDateAndHour(review.createdOn) : 'N/E'}
        </Text>
      </Flex>
      {review.comment && (
        <Text p="4" fontSize="15px" lineHeight="21px" fontWeight="500">
          " {review.comment} "
        </Text>
      )}
    </Box>
  );
};

export const CourierReviews = () => {
  // context
  const { courier } = useContextCourierProfile();
  // state
  const [types, setTypes] = React.useState<CourierReviewType[]>(['positive', 'negative']);
  const [dateStart, setDateStart] = React.useState<string>();
  const [dateEnd, setDateEnd] = React.useState<string>();

  // hook
  const reviwes = useObserveCourierReviews(courier?.id, types, dateStart, dateEnd);
  // helpers

  // handlers

  // side effects

  // UI
  return (
    <Box>
      <SectionTitle>{t('Tipo e período')}</SectionTitle>
      <CheckboxGroup
        colorScheme="green"
        value={types}
        onChange={(values: CourierReviewType[]) => setTypes(values)}
      >
        <HStack
          mt="4"
          alignItems="flex-start"
          color="black"
          spacing={8}
          fontSize="16px"
          lineHeight="22px"
        >
          <CustomCheckbox value="positive">{t('Positivas')}</CustomCheckbox>
          <CustomCheckbox value="negative">{t('Negativas')}</CustomCheckbox>
        </HStack>
      </CheckboxGroup>
      <CustomDateFilter mt="4" getStart={setDateStart} getEnd={setDateEnd} showWarning />
      {!dateStart || !dateEnd ? (
        <Text mt="4">{t('Selecione tipos e datas que deseja buscar')}</Text>
      ) : reviwes === undefined ? (
        <Text mt="4">{t('Carregando...')}</Text>
      ) : reviwes === null ? (
        <Text mt="4">{t('Não foram encontradas avaliações nas condições informadas.')}</Text>
      ) : (
        <Box>
          <Text mt="4" fontSize="20px" lineHeight="26px" color="black">
            {`${reviwes.length} avaliações no período`}
          </Text>
          {reviwes.map((review) => (
            <CourierReviewsItem key={review.id} review={review} />
          ))}
        </Box>
      )}
    </Box>
  );
};
