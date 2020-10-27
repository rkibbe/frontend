import { TestBed } from '@angular/core/testing';

import { HttpLogInterceptorService } from './http-log-interceptor.service';

xdescribe('HttpLogInterceptorService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: HttpLogInterceptorService = TestBed.get(HttpLogInterceptorService);
        expect(service).toBeTruthy();
    });
});
