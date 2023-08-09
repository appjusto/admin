export interface DashboardProps {
  todayCount?: number;
  todayValue?: number;
  todayAverage?: number;
  todayCanceledCount?: number;
  todayCanceledValue?: number;
  todayInactivityCount?: number;
  todayInactivityValue?: number;
  monthCount?: number;
  monthValue?: number;
  monthAverage?: number;
  monthCanceledCount?: number;
  monthCanceledValue?: number;
  monthInactivityCount?: number;
  monthInactivityValue?: number;
  currentWeekCount?: number;
  currentWeekValue?: number;
  currentWeekAverage?: number;
  currentWeekProduct?: string;
  currentWeekByDay?: number[];
  lastWeekCount?: number;
  lastWeekValue?: number;
  lastWeekByDay?: number[];
}

export type Actions = { type: 'update_dashboard'; payload: DashboardProps };

export const dashboardReducer = (
  _: DashboardProps,
  action: Actions
): DashboardProps => {
  switch (action.type) {
    case 'update_dashboard':
      return action.payload;
    default:
      throw new Error();
  }
};
