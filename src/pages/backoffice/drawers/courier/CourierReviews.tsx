import { OrderConsumerReview, ReviewType, WithId } from '@appjusto/types';
import { Box, CheckboxGroup, Flex, HStack, Icon, Link, Text, Wrap } from '@chakra-ui/react';
import { useObserveCourierReviews } from 'app/api/courier/useObserveCourierReviews';
import { useContextCourierProfile } from 'app/state/courier/context';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import React from 'react';
import { MdThumbDownOffAlt, MdThumbUpOffAlt } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface ItemPros {
  review: WithId<OrderConsumerReview>;
}

const CourierReviewsItem = ({ review }: ItemPros) => {
  // UI
  return (
    <Box mt="4" p="4" bgColor="#EEEEEE" borderRadius="16px">
      <Flex flexDir="row">
        <Box>
          <Icon
            as={review.courier?.rating === 'positive' ? MdThumbUpOffAlt : MdThumbDownOffAlt}
            color={review.courier?.rating === 'positive' ? 'green.600' : 'red'}
            w="24px"
            h="24px"
          />
        </Box>
        <Box ml="4" w="100%">
          <Flex justifyContent="space-between">
            <Text fontSize="15px" lineHeight="21px" fontWeight="700">
              {t('Pedido:')}{' '}
              <Link as={RouterLink} to={`/backoffice/orders/${review.orderId}`} fontWeight="500">
                {review.orderId ?? 'N/E'}
              </Link>
            </Text>
            <Text fontSize="13px" lineHeight="21px" fontWeight="500">
              {review?.reviewedOn ? getDateAndHour(review.reviewedOn) : 'N/E'}
            </Text>
          </Flex>
          {review.courier?.tags && (
            <Wrap py="2">
              {review.courier?.tags.map((tag) => (
                <Text
                  px="2"
                  fontSize="13px"
                  color={tag.type === 'positive' ? 'green' : 'red'}
                  border={`1px solid ${tag.type === 'positive' ? 'green' : 'red'}`}
                  borderRadius="lg"
                >
                  {tag.title}
                </Text>
              ))}
            </Wrap>
          )}
          {review.comment && (
            <Box mt="2">
              <Text fontWeight="700">{t('Comentário geral:')}</Text>
              <Text px="4" fontSize="15px" lineHeight="21px" fontWeight="500">
                " {review.comment} "
              </Text>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export const CourierReviews = () => {
  // context
  const { courier } = useContextCourierProfile();
  // state
  const [types, setTypes] = React.useState<ReviewType[]>(['positive', 'negative']);
  const [dateStart, setDateStart] = React.useState<string>();
  const [dateEnd, setDateEnd] = React.useState<string>();
  // hook
  const reviwes = useObserveCourierReviews(courier?.id, types, dateStart, dateEnd);
  // UI
  return (
    <Box>
      <SectionTitle>{t('Tipo e período')}</SectionTitle>
      <CheckboxGroup
        colorScheme="green"
        value={types}
        onChange={(values: ReviewType[]) => setTypes(values)}
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
