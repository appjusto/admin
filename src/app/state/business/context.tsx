import {
  AreaLogistics,
  Banner,
  Business,
  BusinessService,
  Fee,
  Fleet,
  ManagerWithRole,
  PlatformFees,
  WithId,
} from '@appjusto/types';
import { useObserveAreasByCity } from 'app/api/areas/useObserveAreasByCity';
import { useObserveBannersByFlavor } from 'app/api/banners/useObserveBannersByFlavor';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useBusinessProfileImages } from 'app/api/business/profile/useBusinessProfileImages';
import { useObserveBusinessesManagedBy } from 'app/api/business/profile/useObserveBusinessesManagedBy';
import { useObserveBusinessProfile } from 'app/api/business/profile/useObserveBusinessProfile';
import { BusinessUnit } from 'app/api/business/types';
import { useObserveBusinessFleet } from 'app/api/fleet/useObserveBusinessFleet';
import { useGetManagers } from 'app/api/manager/useGetManagers';
import { usePlatformFees } from 'app/api/platform/usePlatformFees';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useContextFirebaseUser } from '../auth/context';
import { useContextManagerProfile } from '../manager/context';
import { useContextStaffProfile } from '../staff/context';
import { shouldUpdateState } from '../utils';

const watchedFields: (keyof Business)[] = [
  // primitive types
  'accountManagerId',
  'name',
  'companyName',
  'cnpj',
  'phone',
  'phones',
  'status',
  'situation',
  'enabled',
  'profileIssuesMessage',
  'cuisine',
  'description',
  'minimumOrder',
  'preparationModes',
  'fulfillment',
  'averageCookingTime',
  'orderAcceptanceTime',
  'deliveryRange',
  'onboarding',
  'logoExists',
  'coverImageExists',
  'orderPrinting',
  'slug',
  'settings',
  'tags',
  'maxOrdersPerHour',
  'minHoursForScheduledOrders',
  'reviews',
  'services',
  'fleetsIdsAllowed',
  'acceptedPaymentMethods',
  // object types
  'managers',
  'profileIssues',
  'businessAddress',
  'schedules',
];

interface ContextProps {
  platformFees?: PlatformFees | null;
  business?: WithId<Business> | null;
  logo?: string | null;
  cover?: string | null;
  clearBusiness(): void;
  changeBusinessId(businessId?: string | null, clearServices?: boolean): void;
  updateContextBusinessOrderPrint(status: boolean): void;
  businessUnits?: BusinessUnit[] | null;
  // setBusinessIdByBusinesses(): void;
  businessManagers?: ManagerWithRole[];
  setIsGetManagersActive: React.Dispatch<React.SetStateAction<boolean>>;
  fetchManagers(): void;
  logisticsAvailable?: AreaLogistics;
  insuranceAvailable?: BusinessService;
  banners?: WithId<Banner>[] | null;
  businessFleet?: WithId<Fleet> | null;
}

const BusinessContext = React.createContext<ContextProps>({} as ContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessProvider = ({ children }: Props) => {
  // context
  const queryClient = useQueryClient();
  const { user, refreshUserToken } = useContextFirebaseUser();
  const { manager } = useContextManagerProfile();
  const { isBackofficeUser } = useContextStaffProfile();
  const { platformFees } = usePlatformFees();
  // const businesses = useObserveBusinessManagedBy(user?.email);
  const [businessId, setBusinessId] = React.useState<
    string | undefined | null
  >();
  const { current, businessUnits } = useObserveBusinessesManagedBy(
    user?.email,
    businessId,
    isBackofficeUser
  );
  const personificationBusiness = useObserveBusinessProfile(
    businessId,
    isBackofficeUser
  );
  // state
  const [business, setBusiness] = React.useState<WithId<Business> | null>();
  const { logo, cover } = useBusinessProfileImages(business?.id);
  const { updateBusinessProfile } = useBusinessProfile(business?.id, false);
  const [isGetManagersActive, setIsGetManagersActive] = React.useState(false);
  const businessCityAreas = useObserveAreasByCity(
    business?.businessAddress?.state,
    business?.businessAddress?.city
  );
  const [logisticsAvailable, setLogisticsAvailable] =
    React.useState<AreaLogistics>();
  const [insuranceAvailable, setInsuranceAvailable] =
    React.useState<BusinessService>();
  const banners = useObserveBannersByFlavor(
    'business',
    typeof business?.id === 'string',
    true,
    true
  );
  // business managers
  const { managers: businessManagers, fetchManagers } = useGetManagers(
    business?.id,
    business?.managers,
    isGetManagersActive
  );
  // business fleet
  const businessFleet = useObserveBusinessFleet(business?.id);
  // handlers
  const clearBusiness = React.useCallback(() => {
    setBusinessId(null);
    setBusiness(null);
  }, []);
  const clearBusinessLogistics = React.useCallback(() => {
    console.log('Call clearBusinessLogistics');
    const services =
      business?.services?.filter((service) => service.name !== 'logistics') ??
      [];
    updateBusinessProfile({ services });
  }, [business?.services, updateBusinessProfile]);
  // const setBusinessIdByBusinesses = React.useCallback(() => {
  //   if (!businesses) return;
  //   setBusinessId(businesses.find(() => true)?.id ?? null);
  // }, [businesses]);
  const changeBusinessId = React.useCallback(
    (businessId: string, clearServices: boolean = true) => {
      if (clearServices) {
        setLogisticsAvailable(undefined);
        setInsuranceAvailable(undefined);
      }
      setBusinessId(businessId);
    },
    []
  );
  const updateContextBusiness = React.useCallback(
    (newState: WithId<Business> | null) => {
      if (!shouldUpdateState(business, newState, watchedFields)) return;
      else setBusiness(newState);
    },
    [business]
  );
  const updateContextBusinessOrderPrint = (status: boolean) => {
    setBusiness((prev) => {
      if (!prev) return;
      return {
        ...prev,
        orderPrinting: status,
      };
    });
  };
  // side effects
  // refresh manager roles
  React.useEffect(() => {
    if (!business?.id) return;
    if (!manager?.roles) return;
    const role = manager.roles[business.id];
    if (role) {
      refreshUserToken(role);
    } else {
      refreshUserToken(null);
    }
  }, [business?.id, manager, refreshUserToken]);
  React.useEffect(() => {
    if (!user) return;
    if (isBackofficeUser !== false) return;
    const localBusinessId = localStorage.getItem(
      `${process.env.REACT_APP_ENVIRONMENT}-${user.email}`
    );
    if (localBusinessId) {
      setBusinessId(localBusinessId);
      return;
    }
  }, [user, isBackofficeUser]);
  React.useEffect(() => {
    if (!user) return;
    if (isBackofficeUser !== false) return;
    if (!business?.id) return;
    localStorage.setItem(
      `${process.env.REACT_APP_ENVIRONMENT}-${user.email}`,
      business.id
    );
  }, [user, isBackofficeUser, business?.id]);
  React.useEffect(() => {
    if (current === undefined) return;
    updateContextBusiness(current);
    queryClient.invalidateQueries();
  }, [current, updateContextBusiness, queryClient]);
  React.useEffect(() => {
    if (personificationBusiness === undefined) return;
    updateContextBusiness(personificationBusiness);
  }, [personificationBusiness, updateContextBusiness]);
  React.useEffect(() => {
    if (businessCityAreas === undefined) return;
    if (businessCityAreas === null) {
      setLogisticsAvailable('none');
    } else {
      if (businessCityAreas.length > 0) {
        const logistics = businessCityAreas[0].logistics;
        setLogisticsAvailable(logistics);
      }
    }
  }, [business?.id, businessCityAreas]);
  React.useEffect(() => {
    if (!platformFees) return;
    const getInsuranceFee = (): Fee | null => {
      if (businessCityAreas && businessCityAreas.length > 0) {
        if (businessCityAreas[0].insurance)
          return businessCityAreas[0].insurance;
      }
      return platformFees?.insurance.business ?? null;
    };
    const fee = getInsuranceFee();
    if (!fee) return;
    const insurance: BusinessService = {
      name: 'insurance',
      fee,
    };
    setInsuranceAvailable(insurance);
  }, [businessCityAreas, platformFees]);
  React.useEffect(() => {
    if (!business?.situation) return;
    if (business?.situation === 'approved') return;
    if (logisticsAvailable !== 'none') return;
    const logistic = business?.services?.find(
      (service) => service.name === 'logistics'
    );
    if (logistic) clearBusinessLogistics();
  }, [
    logisticsAvailable,
    business?.situation,
    business?.services,
    clearBusinessLogistics,
  ]);
  // provider
  return (
    <BusinessContext.Provider
      value={{
        platformFees,
        business,
        logo,
        cover,
        clearBusiness,
        changeBusinessId,
        updateContextBusinessOrderPrint,
        businessUnits,
        // setBusinessIdByBusinesses,
        businessManagers,
        setIsGetManagersActive,
        fetchManagers,
        logisticsAvailable,
        insuranceAvailable,
        banners,
        businessFleet,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useContextBusiness = () => {
  return React.useContext(BusinessContext);
};

export const useContextBusinessId = () => {
  const { business } = useContextBusiness();
  return business?.id;
};
