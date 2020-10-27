import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
    let service: SnackbarService;
    let httpTestingController: HttpTestingController;
    const mockSnackBarData = {
        message: 'SnackBar Data'
    };
    const mockMatSnackBar = {
        openFromComponent: jasmine.createSpy('openFromComponent')
    };
    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, StoreModule.forRoot({})],
            providers: [SnackbarService, { provide: MatSnackBar, useValue: mockMatSnackBar }]
        })
    );
    beforeEach(() => {
        service = TestBed.get(SnackbarService);
        httpTestingController = TestBed.get(HttpTestingController);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should be call openSnackBar', () => {
        spyOn(service, 'openSnackBar').and.callThrough();
        service.openSnackBar(mockSnackBarData);
        expect(mockMatSnackBar.openFromComponent).toHaveBeenCalled();
    });
});
