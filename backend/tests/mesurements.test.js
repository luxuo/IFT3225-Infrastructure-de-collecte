import {describe, it, expect, beforeEach} from "vitest";

let crowdednessLevel;
describe("Crowdedness Level", () => {
    beforeEach(() => {
        crowdednessLevel = require("../src/services/componentReuse").crowdednessLevel;
    });

    it("should return 'vide' for 0 average people", () => {
        expect(crowdednessLevel(0)).toBe("vide");
    });

    it("should return 'faible' for average people between 1 and 6", () => {
        expect(crowdednessLevel(3)).toBe("faible");
    }); 

    it("should return 'moyen' for average people between 7 and 13", () => {
        expect(crowdednessLevel(10)).toBe("moyen");
    });

    it("should return 'eleve' for average people 14 or more", () => {
        expect(crowdednessLevel(15)).toBe("eleve");
    });
});