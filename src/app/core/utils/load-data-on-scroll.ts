import { DrawerContentScrollService } from '../../core/services/drawer-content-scroll/drawer-content-scroll.service';

export function isMoreDataToLoad<T>(drawerContentScrollService: DrawerContentScrollService, data: T[], limit: number) {
  if (data.length < limit) {
    drawerContentScrollService.loadData.set(false);
    return;
  } 

  drawerContentScrollService.loadData.set(true)
}
