import { modalUsesVerticalBars } from '../shared/modal.js';
import { createCandidate, appendItem } from '../shared/candidate.js';
import type { Candidate, Identify } from '../shared/candidate.js';
import { inFixedToolbar, isVerticalBarsToolbarAction, isVerticalBarsToolbarGroup } from '../shared/dom.js';

export const tag = 'ion-button';

export const read = (element: HTMLElement, id: Identify): Candidate | undefined => {
  const button = element as HTMLIonButtonElement;
  const verticalBars =
    !element.closest('ion-menu, ion-popover') && modalUsesVerticalBars(element) && !!element.closest('ion-app.ios-theme-vertical-bars');
  if (verticalBars && element.parentElement && isVerticalBarsToolbarGroup(element.parentElement)) return;
  const fill = button.fill ?? 'default';
  if (
    !inFixedToolbar(element) ||
    (verticalBars && !isVerticalBarsToolbarAction(element)) ||
    (!verticalBars && fill !== 'default') ||
    (!verticalBars && button.classList.contains('ion-color'))
  )
    return;
  const candidate = createCandidate(element, tag, id);
  return appendItem(candidate, element, id) ? candidate : undefined;
};
