import { Route } from '@angular/router';
import { FeedbackDetailsComponent } from './component/feedback-details/feedback-details.component';
import { FeedbackListComponent } from './component/feedback-list/feedback-list.component';

export const adminFrontendFeedbackAdminRoutes: Route[] = [
  { component: FeedbackDetailsComponent, path: 'user-message/:id' },
  { component: FeedbackListComponent, path: 'user-message' },
];
