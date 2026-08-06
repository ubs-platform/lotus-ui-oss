import { ActivatedRoute, Data } from '@angular/router';

/**
 * Angular route `data` doesn't inherit to child routes by default, so this walks
 * the ancestor chain and merges `data` (closest ancestor wins) to read values set
 * on a route higher up the tree (e.g. the top-level feature route).
 */
export function collectAncestorRouteData(route: ActivatedRoute): Data {
  return route.snapshot.pathFromRoot.reduce(
    (acc, r) => ({ ...acc, ...r.data }),
    {} as Data
  );
}
