import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';
import React, { RefObject } from 'react';

export const navigationRef: RefObject<any> = React.createRef();

export function navigate(name: string, params = {}): void {
  navigationRef.current.navigate(name, params);
}

export function goBack(): void {
  if (navigationRef.current.canGoBack) navigationRef.current.goBack();
}

export function popToTop(): void {
  navigationRef.current.dispatch(StackActions.popToTop());
}

export function backTo(count: number): void {
  navigationRef.current.dispatch(StackActions.pop(count));
}

export function navigateReplace(name: string, params = {}): void {
  navigationRef.current.dispatch(StackActions.replace(name, params));
}

export function drawerToggle(): void {
  navigationRef.current.dispatch(DrawerActions.toggleDrawer());
}

export function reset(name?: string) {
  navigationRef.current.dispatch({
    ...CommonActions.reset({
      index: 1,
      routes: [{ name: name as string }],
    }),
  });
}
