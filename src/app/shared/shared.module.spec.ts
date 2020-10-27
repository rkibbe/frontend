import { SharedModule } from './shared.module';

xdescribe('SharedModule', () => {
    let sharedModule: SharedModule;

    beforeEach(() => {
        sharedModule = new SharedModule();
    });

    it('should create an instance', () => {
        expect(sharedModule).toBeTruthy();
    });
});
