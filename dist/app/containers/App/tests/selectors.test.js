"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selectors_1 = require("containers/App/selectors");
describe('makeSelectLocation', () => {
    it('should select the location', () => {
        const router = {
            location: { pathname: '/foo' },
        };
        const mockedState = {
            router,
        };
        expect(selectors_1.makeSelectLocation()(mockedState)).toEqual(router.location);
    });
});
