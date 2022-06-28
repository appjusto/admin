import React from "react";
import { useHistory } from "react-router-dom";

export const useRedirectToOrders = (exceptionsPaths: string[]) => {
  // context
  const { push, location } =useHistory();
  // handler
  const redirectToOrders = React.useCallback(() => {
    let exception = false;
    exceptionsPaths.forEach(path => {
      if(location.pathname.includes(path)) exception = true;
    })
    if(exception) return;
    push("/app/orders");
  }, [push, location, exceptionsPaths])
  // result
  return redirectToOrders;
}