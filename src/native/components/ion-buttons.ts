import { modalUsesVerticalBars } from '../shared/modal.js';
import { createCandidate, appendItem } from '../shared/candidate.js';
import type { Candidate, Identify } from '../shared/candidate.js';
import { childElements, verticalBarsToolbarActions, inFixedToolbar, isVerticalBarsToolbarGroup } from '../shared/dom.js';
import * as menuButton from './ion-menu-button.js';

export const tag = 'ion-buttons';
export const tracksMotion = true;

export const read = (element: HTMLElement, id: Identify): Candidate | undefined => {
  if (!inFixedToolbar(element)) return;
  let children = childElements(element);
  if (children.length === 1) return menuButton.read(element, id);
  const verticalBars =
    !element.closest('ion-menu, ion-popover') && modalUsesVerticalBars(element) && !!element.closest('ion-app.ios-theme-vertical-bars');
  if (verticalBars && !isVerticalBarsToolbarGroup(element)) return;
  if (verticalBars) children = verticalBarsToolbarActions(element);
  if (
    !children.length ||
    children.some(
      (child) =>
        !child.matches(`${menuButton.tag}${verticalBars ? '' : '.ios'}`) &&
        (!child.matches(`ion-button${verticalBars ? '' : '.ios.button-clear'}`) ||
          (!verticalBars && (child as HTMLIonButtonElement).fill !== 'clear')),
    )
  )
    return;
  const candidate = createCandidate(element, tag, id);
  if (verticalBars && children.length !== childElements(element).length) candidate.sources = children;
  for (const child of children) {
    const supported = child.matches(menuButton.tag)
      ? menuButton.append(candidate, child as HTMLIonMenuButtonElement, id)
      : appendItem(candidate, child, id);
    if (!supported) return;
  }
  return candidate;
};
