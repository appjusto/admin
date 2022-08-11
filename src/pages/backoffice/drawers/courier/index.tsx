import { CourierProvider } from 'app/state/courier/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { CourierBaseDrawer } from './CourierBaseDrawer';
import { CourierIugu } from './CourierIugu';
import { CourierOrders } from './CourierOrders';
import { CourierRegister } from './CourierRegister';
import { CourierReviews } from './CourierReviews';
import { Location } from './Location';
import { CourierStatus } from './status/CourierStatus';

interface CourierDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

const CourierDrawer = ({ onClose, ...props }: CourierDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { staff, username } = useContextStaffProfile();
  //UI
  return (
    <CourierProvider>
      <CourierBaseDrawer
        staff={{ id: staff?.id, name: username }}
        onClose={onClose}
        {...props}
      >
        <Switch>
          <Route exact path={`${path}`}>
            <CourierRegister />
          </Route>
          <Route exact path={`${path}/status`}>
            <CourierStatus />
          </Route>
          <Route exact path={`${path}/location`}>
            <Location />
          </Route>
          <Route exact path={`${path}/orders`}>
            <CourierOrders />
          </Route>
          <Route exact path={`${path}/iugu`}>
            <CourierIugu />
          </Route>
          <Route exact path={`${path}/reviews`}>
            <CourierReviews />
          </Route>
        </Switch>
      </CourierBaseDrawer>
    </CourierProvider>
  );
};

export default CourierDrawer;
