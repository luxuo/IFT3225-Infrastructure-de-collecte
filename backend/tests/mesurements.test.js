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

let classmentAmbiance;
describe("Classment Ambiance", () => {
    beforeEach(() => {
        classmentAmbiance = require("../src/services/componentReuse").classmentAmbiance;
    });
    it ("should throw error for non number input", () => {
        expect(() => classmentAmbiance("not a number")).toThrow("Invalid input: avgDb must be a positive number");
    });
    it ("should throw error for negative number input", () => {
        expect(() => classmentAmbiance(-10)).toThrow("Invalid input: avgDb must be a positive number");
    });
    it("should return 'calme' for avgDb less than 60", () => {
        expect(classmentAmbiance(50)).toBe("calme");
    });
    it("should return 'moyen' for avgDb between 60 and 69", () => {
        expect(classmentAmbiance(65)).toBe("moyen");
    });
    it("should return 'modéré' for avgDb between 70 and 79", () => {
        expect(classmentAmbiance(75)).toBe("modéré");
    });
    it("should return 'elevé' for avgDb 80 or more", () => {
        expect(classmentAmbiance(85)).toBe("elevé");
    });
});

let dataVerification;
describe("Data Verification", () => {
    beforeEach(() => {
        dataVerification = require("../src/services/componentReuse").dataVerification;
    });
    it ("should return false for non-existant input", () => {
        expect(dataVerification()).toBe(false);
    })
    it ("should return false for empty array input", () => {
        expect(dataVerification([])).toBe(false);
    })
    it ("should return false for non confirming input", () =>{
        expect(dataVerification("not array")).toBe(false);
    })
    it ("should return true for non-empty array input", () => {
        expect(dataVerification([1, 2, 3])).toBe(true);
    })
});

let dailyAudio;
describe("Daily Audio", () => {
    beforeEach(() => {
        dailyAudio = require("../src/services/componentReuse").dailyAudio;
    });
    it("should return an array of 24 objects with hour, totalDbSum, and totalDbCount", () => {
        const measurements = [
            { timestamp: "2024-06-01T00:00:00Z", noise_buffer: [50, 60, 70] },
        ];
        expect(dailyAudio(measurements)).toHaveLength(24);
    });
});