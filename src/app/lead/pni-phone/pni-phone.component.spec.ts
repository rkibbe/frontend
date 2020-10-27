import { TestBed } from '@angular/core/testing';
import { SavePNIData } from '@app/store/actions/lead.actions';
import { initialState } from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { InputMaskDirective } from '@shared/directives/input-mask.directive';
import { Formatter } from '@shared/formatters/formatter';
import { PhoneFormatter } from '@shared/formatters/phone-formatter';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { render, RenderResult } from '@testing-library/angular';
import { MockStore } from '@testing/mocks/store/store';
import { getButtonWrapperElement, TestingModule } from '@testing/utils';
import { PniPhoneComponent } from './pni-phone.component';
import { TranslateModule } from '@ngx-translate/core';

describe('PniPhoneComponent', () => {
    const VALID_TEST_NUMBER = '5168889999';
    let VALID_TEST_NUMBER_FORMATTED;

    const INVALID_TEST_NUMBER = '55555';
    let INVALID_TEST_NUMBER_FORMATTED;

    async function setUp(preFill: boolean, phoneNumber: string = '') {
        const component: RenderResult = await render(PniPhoneComponent, {
            declarations: [PniPhoneComponent, PageImageTitleComponent, InputMaskDirective],
            imports: [TestingModule, TranslateModule.forRoot()],
            providers: [
                PhoneFormatter,
                {
                    provide: NavigationService,
                    useValue: {
                        setPhonePageFlag: jasmine.createSpy('setPhonePageFlag'),
                        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
                        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
                        currentRouteObj: { preFill }
                    }
                }
            ],
            detectChanges: false
        });

        const mockedStore: MockStore<any> = TestBed.get(Store);
        const mockedNavService: NavigationService = TestBed.get(NavigationService);

        const phoneFormatter: Formatter = TestBed.get(PhoneFormatter);
        VALID_TEST_NUMBER_FORMATTED = phoneFormatter.format(VALID_TEST_NUMBER);
        INVALID_TEST_NUMBER_FORMATTED = phoneFormatter.format(INVALID_TEST_NUMBER);

        mockedStore.setState({
            lead: { ...initialState, phoneNumber }
        });
        spyOn(mockedStore, 'dispatch');

        component.fixture.detectChanges();

        const phoneNumberInput: HTMLInputElement = component.getByLabelText('Phone number') as HTMLInputElement;

        const nextButton: HTMLButtonElement = getButtonWrapperElement(
            await component.getByText('NEXT', { selector: 'button *' })
        ) as HTMLButtonElement;

        return {
            component,
            phoneNumberInput,
            nextButton,
            mockedStore,
            mockedNavService
        };
    }

    it('should have an empty phone input field when no number is present', async () => {
        const { phoneNumberInput } = await setUp(true);
        expect(phoneNumberInput.value).toBeFalsy();
    });

    it('should have an empty phone input field when route preFill is false', async () => {
        const { phoneNumberInput } = await setUp(false, VALID_TEST_NUMBER);
        expect(phoneNumberInput.value).toBeFalsy();
    });

    it('should prefill with a formatted number if one is present and route preFill is true', async () => {
        const { phoneNumberInput } = await setUp(true, VALID_TEST_NUMBER);
        expect(phoneNumberInput.value).toEqual(VALID_TEST_NUMBER_FORMATTED);
    });

    it('should have a disabled "NEXT" button when no number is present', async () => {
        const { nextButton } = await setUp(true);

        expect(nextButton.disabled).toBe(true);
    });

    it('should have a disabled "NEXT" button when invalid number is present', async () => {
        const { component, phoneNumberInput, nextButton } = await setUp(true);

        component.input(phoneNumberInput, {
            target: { value: INVALID_TEST_NUMBER }
        });

        expect(nextButton.disabled).toBe(true);
    });

    it('should have an enabled "NEXT" button when valid number is present', async () => {
        const { component, phoneNumberInput, nextButton } = await setUp(true);

        component.input(phoneNumberInput, {
            target: { value: VALID_TEST_NUMBER }
        });

        expect(nextButton.disabled).toBe(false);
    });

    it('should have formatted text on input', async () => {
        const { component, phoneNumberInput } = await setUp(true);

        await component.input(phoneNumberInput, {
            target: { value: VALID_TEST_NUMBER }
        });

        expect(phoneNumberInput.value).toEqual(VALID_TEST_NUMBER_FORMATTED);
    });

    it('should show error message on input blur', async () => {
        const { component, phoneNumberInput } = await setUp(true);

        expect(
            component.queryByText(`It doesn't look like that is a valid phone number, want to try again?`)
        ).toBeFalsy();

        await component.input(phoneNumberInput, {
            target: { value: INVALID_TEST_NUMBER }
        });

        expect(
            component.queryByText(`It doesn't look like that is a valid phone number, want to try again?`)
        ).toBeFalsy();

        component.blur(phoneNumberInput);

        expect(phoneNumberInput.value).toEqual(INVALID_TEST_NUMBER_FORMATTED);
        expect(
            component.queryByText(`It doesn't look like that is a valid phone number, want to try again?`)
        ).toBeTruthy();
    });

    it('should save phone number to lead on submit', async () => {
        const { component, mockedStore, nextButton } = await setUp(true, VALID_TEST_NUMBER);

        component.click(nextButton);

        expect(mockedStore.dispatch).toHaveBeenCalledWith(new SavePNIData({ phoneNumber: VALID_TEST_NUMBER }));
    });

    it('should set phone page flag on submit', async () => {
        const { component, mockedNavService, nextButton } = await setUp(true, VALID_TEST_NUMBER);

        component.click(nextButton);

        expect(mockedNavService.setPhonePageFlag).toHaveBeenCalledWith(true);
    });

    it('should save the lead and navigate on submit', async () => {
        const { component, mockedNavService, nextButton } = await setUp(true, VALID_TEST_NUMBER);

        component.click(nextButton);

        expect(typeof (mockedNavService.saveLeadAndNavigate as any).calls.mostRecent().args[0] === 'object');
    });
});
