/*
    This is test for index calling
    All tests goals have been listed in the code
    Before test function
*/
const supertest = require("supertest");
const should = require("should");

// This agent refers to PORT where program is runninng.
const server = supertest.agent("https://localhost:8080");

describe("index unit test",function(){

    // #1 should return home page
    it("should return home page",function(done){
        server
            .get("/")
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                should(res.status).equal(200);
                // Error key should be false.
                //should(res.body.error).equal(false);
                done();
            });
    });

    // #2 should return login page
    it("should return login page",function(done){
        server
            .get("/login")
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                should(res.status).equal(200);
                // Error key should be false.
                //res.body.error.should.equal(false);
                done();
            });
    });

    // #3 should return register page
    it("should return register page",function(done){
        server
            .get("/register")
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                should(res.status).equal(200);
                // Error key should be false.
                //res.body.error.should.equal(false);
                done();
            });
    });
});
