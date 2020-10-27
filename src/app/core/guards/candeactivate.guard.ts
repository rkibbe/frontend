import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ComponentCanDeactivate } from './component.deactive';
import { MatDialog } from '@angular/material';
import { PageLeavingAlertModalComponent } from '@shared/page-leaving-alert-modal/page-leaving-alert-modal.component';
import { NavigationService } from '@services/navigation.service';
import { SharedService } from '@services/shared.service';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { DefaultReviewComponent } from '@app/lead/default-review/default-review.component';
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<DefaultReviewComponent> {
    constructor(private dialog: MatDialog, private navService: NavigationService,
        private sharedService: SharedService, private location: Location,
        private router: Router) {
    }
    canDeactivate(
        component: DefaultReviewComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot,
    ): boolean | Observable<boolean> {
        const policyReviewIndex = this.navService.getRouteIndexByName('policyreview');
        const nextOrPrevRouteName = nextState.url ? nextState.url.substr(1) : 'null';
        const nextOrPrevRouteIndex = this.navService.getRouteIndexByName(nextOrPrevRouteName);
        // if it is previous route(back button)
        if (policyReviewIndex > nextOrPrevRouteIndex && component.coveragesEdited) {
            this.dialog.open(PageLeavingAlertModalComponent, {
                panelClass: 'common-modal-panel',
                data: nextOrPrevRouteName
            });
            return this.sharedService.navigateAwaySelection$.pipe(map(leaveThePage => {
                if (!leaveThePage) {
                    const currentUrlTree = this.router.createUrlTree([], currentRoute);
                    const currentUrl = currentUrlTree.toString();
                    this.location.go(currentUrl);
                    return false;
                }
                return true;
            }));
        } else {
            return true;
        }
    }
}
