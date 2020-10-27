import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DefaultReviewComponent } from '@app/lead/default-review/default-review.component';
import { NavigationService } from '@services/navigation.service';
import { SharedService } from '@services/shared.service';
import { PageLeavingAlertModalComponent } from '@shared/page-leaving-alert-modal/page-leaving-alert-modal.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of } from 'rxjs';
import { CanDeactivateGuard } from './candeactivate.guard';

describe('CanDeactivateGuard', () => {
    let guard: CanDeactivateGuard;
    let mockedDefaultReviewComponent: DefaultReviewComponent;
    const routeStateMock: any = { snapshot: {}, url: '/policyreview' };
    const routerMock = { navigate: jasmine.createSpy('navigate') };
    let mockedDialog;
    const mockedSharedService = {
        navigateAwaySelection$: jasmine.createSpy('navigateAwaySelection$').and.returnValue(of({}))
    };
    const mockedLocation = {
        go: jasmine.createSpy('go')
    };
    const mockedNavigationService = {
        getRouteIndexByName: jasmine.createSpy('getRouteIndexByName')
    };
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
    dialogRefSpyObj.componentInstance = { body: '' };
    let dialog;
    let mockedRouterStateSnapshotCurrentState;
    let mockedRouterStateSnapshotNextState;
    let mockedActivatedRouteSnapshot: ActivatedRouteSnapshot;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                PageLeavingAlertModalComponent
                // DefaultReviewComponent
            ],
            providers: [
                CanDeactivateGuard,
                { provide: Router, useValue: routerMock },
                // { provide: MatDialog, useValue: mockedDialog },
                { provide: DefaultReviewComponent, useValue: mockedDefaultReviewComponent },
                { provide: RouterStateSnapshot, useValue: mockedRouterStateSnapshotCurrentState },
                { provide: RouterStateSnapshot, useValue: mockedRouterStateSnapshotNextState },
                { provide: SharedService, useValue: mockedSharedService },
                { provide: ActivatedRouteSnapshot, useValue: mockedActivatedRouteSnapshot },
                { provide: NavigationService, useValue: mockedNavigationService },
                { provide: Location, useValue: mockedLocation }
            ],
            imports: [HttpClientTestingModule, VertiMaterialModule, RouterTestingModule, BrowserAnimationsModule]
        });
        guard = TestBed.get(CanDeactivateGuard);

        mockedDialog = TestBed.get(MatDialog);
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });
    it('should return canDeactivate is true', () => {
        expect(guard.canDeactivate(null, null, null, routeStateMock)).toEqual(true);
    });
    it('should pass all value to canDeactivate and return is true', () => {
        expect(
            guard.canDeactivate(
                mockedDefaultReviewComponent,
                mockedActivatedRouteSnapshot,
                routeStateMock,
                routeStateMock
            )
        ).toEqual(true);
    });
    it('should return canDeactivate is true', () => {
        mockedRouterStateSnapshotCurrentState = {
            currentState: {
                url: 'test'
            }
        };
        mockedRouterStateSnapshotNextState = {
            nextState: {
                url: 'test'
            }
        };
        expect(
            guard.canDeactivate(null, null, mockedRouterStateSnapshotCurrentState, mockedRouterStateSnapshotNextState)
        ).toEqual(true);
    });
});
