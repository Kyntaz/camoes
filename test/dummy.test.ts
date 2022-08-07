import { hello } from "../src";

describe("#Dummy", () => {
    it("is hello there", () => {
        expect(hello).toBe("Hello there!");
    });
});
