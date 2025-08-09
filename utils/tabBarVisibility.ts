let hideFn = () => {};
let showFn = () => {};

export function registerTabBarVisibility(hide: () => void, show: () => void) {
  hideFn = hide;
  showFn = show;
}

export function triggerHideTabBar() {
  hideFn();
}

export function triggerShowTabBar() {
  showFn();
}

let lastOffsetY = 0;
export function handleScrollDirection(offsetY: number) {
  if (offsetY > lastOffsetY + 5) {
    triggerHideTabBar();
  } else if (offsetY < lastOffsetY - 5) {
    triggerShowTabBar();
  }
  lastOffsetY = offsetY;
}
