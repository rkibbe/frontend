import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenConfirmComponent } from './token-confirm.component';
import { Store } from '@ngrx/store';
import * as LoaderActions from '@app/store/actions/loader.actions';

describe('TokenConfirmComponent', () => {
    let component: TokenConfirmComponent;
    let fixture: ComponentFixture<TokenConfirmComponent>;
    const mockedStore = {
        dispatch: jasmine.createSpy('dispatch')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TokenConfirmComponent],
            providers: [{ provide: Store, useValue: mockedStore }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TokenConfirmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should start loder on oninit', () => {
        component.ngOnInit();
        expect(mockedStore.dispatch).toHaveBeenCalled();
        expect(mockedStore.dispatch).toHaveBeenCalledWith(new LoaderActions.StartLoaderAction());
    });
});
