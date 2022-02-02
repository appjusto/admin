import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Link,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { useRecommendation } from 'app/api/consumer/useRecommendation';
import { phoneFormatter } from 'common/components/form/input/pattern-input/formatters';
import React from 'react';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  recommendationId: string;
};

export const RecommendationBaseDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { recommendationId } = useParams<Params>();
  const recommendation = useRecommendation(recommendationId);
  //UI
  if (recommendation === undefined)
    return (
      <Drawer placement="right" size="lg" onClose={onClose} {...props}>
        <DrawerOverlay>
          <DrawerContent mt={{ base: '16', md: '0' }}>
            <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
            <DrawerHeader pb="6">
              <SectionTitle mt="0">{t('Indicação...')}</SectionTitle>
            </DrawerHeader>
            <DrawerBody pb="28">
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Criada em:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Consumidor:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Telefone:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Instagram:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Endereço:')} <Skeleton as="span" maxW="100px" />
              </Text>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  if (recommendation === null)
    return (
      <Drawer placement="right" size="lg" onClose={onClose} {...props}>
        <DrawerOverlay>
          <DrawerContent mt={{ base: '16', md: '0' }}>
            <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
            <DrawerHeader pb="6">
              <SectionTitle mt="0">{t('Indicação')}</SectionTitle>
            </DrawerHeader>
            <DrawerHeader pb="2">
              <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
                {t('Dados não encontrados')}
              </Text>
            </DrawerHeader>
            <DrawerBody pb="28"></DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent mt={{ base: '16', md: '0' }}>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="6">
            <SectionTitle mt="0">
              {recommendation.recommendedBusiness.address.main ?? 'Nome não encontrado'}
            </SectionTitle>
          </DrawerHeader>
          <DrawerBody pb="28">
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Criada em:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(recommendation?.createdOn)}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Consumidor:')}{' '}
              {recommendation.consumerId ? (
                <Link
                  as={RouterLink}
                  to={`/backoffice/consumers/${recommendation.consumerId}`}
                  fontWeight="500"
                >
                  {recommendation.consumerId}
                </Link>
              ) : (
                <Text as="span" fontWeight="500">
                  {'N/E'}
                </Text>
              )}
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Dono ou gerente:')}{' '}
              <Text as="span" fontWeight="500">
                {recommendation?.owner ?? 'N/I'}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Telefone:')}{' '}
              <Text as="span" fontWeight="500">
                {recommendation?.phone ? phoneFormatter(recommendation.phone) : 'N/I'}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Instagram:')}{' '}
              <Text as="span" fontWeight="500">
                {recommendation.instagram ?? 'N/I'}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Endereço:')}{' '}
              <Text as="span" fontWeight="500">
                {recommendation.recommendedBusiness.address.secondary}
              </Text>
            </Text>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
