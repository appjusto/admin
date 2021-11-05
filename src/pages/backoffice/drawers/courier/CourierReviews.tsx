import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import { CourierReview, CourierReviewType } from 'app/api/courier/CourierApi';
import { useObserveCourierReviews } from 'app/api/courier/useObserveCourierReviews';
import { useContextCourierProfile } from 'app/state/courier/context';
import { WithId } from 'appjusto-types';
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
    <Box>
      <HStack>
        <Icon
          as={review.type === 'positive' ? MdThumbUpOffAlt : MdThumbDownOffAlt}
          color={review.type === 'positive' ? 'green.600' : 'red'}
        />
        <Text>{t(`Id do pedido: ${review.orderId ?? 'N/E'}`)}</Text>
        <Text>{review.createdOn ? getDateAndHour(review.createdOn) : 'N/E'}</Text>
      </HStack>
      {review.comment && <Text>"{review.comment}"</Text>}
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
      <CustomDateFilter mt="4" getStart={setDateStart} getEnd={setDateEnd} showWarning />
      {!dateStart || !dateEnd ? (
        <Text mt="4">{t('Selecione as datas que deseja buscar')}</Text>
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
