import { DrawerContentScrollService } from '../../core/services/drawer-content-scroll/drawer-content-scroll.service';

export function isMoreDataToLoad<T>(drawerContentScrollService: DrawerContentScrollService, data: T[]) {
  if (data.length === 0) {
    drawerContentScrollService.loadData.set(false);
    return;
  } 

  drawerContentScrollService.loadData.set(true)
}
