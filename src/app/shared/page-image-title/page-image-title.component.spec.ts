import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageImageTitleComponent } from './page-image-title.component';

xdescribe('PlaceholderImageComponent', () => {
    let component: PageImageTitleComponent;
    let fixture: ComponentFixture<PageImageTitleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageImageTitleComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageImageTitleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
