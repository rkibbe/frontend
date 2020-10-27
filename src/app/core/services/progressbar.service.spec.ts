import { TestBed } from '@angular/core/testing';
import { ProgressbarService } from './progressbar.service';


describe('ProgressbarService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ProgressbarService = TestBed.get(ProgressbarService);
        expect(service).toBeTruthy();
    });
});
