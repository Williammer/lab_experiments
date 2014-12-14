describe("ttttttest", function() {
    it("would small event happen?", function() {
        var rand = (Math.random())*10;
        console.log("rand: "+rand );
        expect(rand).toBeLessThan(10);
    });
});