import { NavigationExtras, UrlCreationOptions } from '@angular/router';
import { DialogInformation, WebDialogUtils } from '@lotus/front-global/webdialog';

export class NgxMobileExperienceUtil {
  public static internalPageChange(): Partial<NavigationExtras> {
    if (location.href == '') {
      return {};
    } else {
      return DialogInformation.onMobile
        ? {
            replaceUrl: true,
            // skipLocationChange: true,
          }
        : {};
    }
  }

  public static mainContextChange(): Partial<NavigationExtras> {
    if (location.href == '') {
      return {};
    } else {
      return DialogInformation.onMobile
        ? {
            replaceUrl: true,
            // skipLocationChange: true,
          }
        : {};
    }
  }
}
