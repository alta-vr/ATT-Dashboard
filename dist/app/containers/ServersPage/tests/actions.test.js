"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../actions");
const constants_1 = require("../constants");
describe('ServersPage actions', () => {
    describe('Default Action', () => {
        it('has a type of DEFAULT_ACTION', () => {
            const expected = {
                type: constants_1.DEFAULT_ACTION,
            };
            expect(actions_1.defaultAction()).toEqual(expected);
        });
    });
});
