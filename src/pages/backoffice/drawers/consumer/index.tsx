import { ConsumerProvider } from 'app/state/consumer/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ConsumerBaseDrawer } from './ConsumerBaseDrawer';
import { ConsumerOrders } from './ConsumerOrders';
import { ConsumerStatus } from './ConsumerStatus';
import { PaymentMethods } from './PaymentMethods';
import { PersonalProfile } from './PersonalProfile';

interface ConsumerDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

const ConsumerDrawer = ({ onClose, ...props }: ConsumerDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { staff, username } = useContextStaffProfile();
  //UI
  return (
    <ConsumerProvider>
      <ConsumerBaseDrawer
        staff={{ id: staff?.id, name: username }}
        onClose={onClose}
        {...props}
      >
        <Switch>
          <Route exact path={`${path}`}>
            <PersonalProfile />
          </Route>
          <Route exact path={`${path}/payment`}>
            <PaymentMethods />
          </Route>
          <Route exact path={`${path}/orders`}>
            <ConsumerOrders />
          </Route>
          <Route exact path={`${path}/status`}>
            <ConsumerStatus />
          </Route>
        </Switch>
      </ConsumerBaseDrawer>
    </ConsumerProvider>
  );
};

export default ConsumerDrawer;
