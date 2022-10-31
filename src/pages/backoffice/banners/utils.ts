import { Banner, BannersOrdering, ClientFlavor, WithId } from '@appjusto/types';
import { arrayMove } from 'app/utils/arrayMove';

export const getBannersByFlavorOrdered = (
  flavorArray: string[],
  banners: WithId<Banner>[]
) => {
  return banners.sort((a: WithId<Banner>, b: WithId<Banner>) => {
    const aIndex = flavorArray.indexOf(a.id);
    const bIndex = flavorArray.indexOf(b.id);
    return aIndex - bIndex;
  });
};

export const updateBannerOrdering = (
  ordering: BannersOrdering,
  flavor: ClientFlavor,
  previousIndex: number,
  newIndex: number
) => {
  const flavorArray = ordering[flavor];
  return {
    ...ordering,
    [flavor]: arrayMove<string>(flavorArray, previousIndex, newIndex),
  } as BannersOrdering;
};
