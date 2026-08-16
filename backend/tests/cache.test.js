const {getCache, setCache, deleteCache} = require('../src/services/cache');
import {describe, it, expect, beforeEach} from "vitest";

let cache;
describe("Cache Service", () => {
    beforeEach(() => {
        cache = require('../src/services/cache');
    });
    it("should set and get a cache value", () => {
        setCache("testKey", "testValue");
        const value = getCache("testKey");
        expect(value).toBe("testValue");
    });

    it("should return undefined for a non-existent key", () => {
        const value = getCache("nonExistentKey");
        expect(value).toBeUndefined();
    });

    it("should delete a cache value", () => {
        setCache("testKey", "testValue");
        deleteCache("testKey");
        const value = getCache("testKey");
        expect(value).toBeUndefined();
    });
});
