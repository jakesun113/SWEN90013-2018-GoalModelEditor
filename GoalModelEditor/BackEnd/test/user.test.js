/*
    This is test for user api
    All tests goals have been listed in the code
    Before test function
*/
const supertest = require("supertest");
const should = require("should");

// This agent refers to PORT where program is runninng.
const server = supertest.agent("https://localhost:8080");

describe("user unit test", function() {
    // #1 should login successfully
    // with correct username and password
    it("should login successfully", function(done) {
        server
            .post("/user/login")
            .send({ username: "ttt", password: "ttt" })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                should(res.status).equal(200);
                done();
            });
    });

    // #2 should not login successfully
    // with incorrect username and password
    it("should not login successfully", function(done) {
        server
            .post("/user/login")
            .send({ username: "abc", password: "abc" })
            .expect("Content-type", /json/)
            .expect(401)
            .end(function(err, res) {
                should(res.status).equal(401);
                //res.body.error.should.equal(true);
                done();
            });
    });

    // #3 should not login successfully
    // with incorrect username and correct password
    it("should not login successfully", function(done) {
        server
            .post("/user/login")
            .send({ username: "abc", password: "ttt" })
            .expect("Content-type", /json/)
            .expect(401)
            .end(function(err, res) {
                should(res.status).equal(401);
                done();
            });
    });

    // #4 should not login successfully
    // with correct username and incorrect password
    it("should not login successfully", function(done) {
        server
            .post("/user/login")
            .send({ username: "ttt", password: "abc" })
            .expect("Content-type", /json/)
            .expect(401)
            .end(function(err, res) {
                should(res.status).equal(401);
                done();
            });
    });

    // #5 should login successfully
    // with correct username and password
    it("should login successfully", function(done) {
        server
            .post("/user/login")
            .send({ username: "testfz", password: "testfz" })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                should(res.status).equal(200);
                done();
            });
    });

    // #6 should not login successfully
    // with incorrect username and password
    it("should not login successfully", function(done) {
        server
            .post("/user/login")
            .send({ username: "@a~^1-9%$'", password: "@a~^1-9%$" })
            .expect("Content-type", /json/)
            .expect(401)
            .end(function(err, res) {
                should(res.status).equal(401);
                done();
            });
    });

    // #7 should sign up successfully
    // with all legal attributes
    it("should sign up successfully", function(done) {
        server
            .post("/user/register")
            .send({
                username: "zxc",
                password: "zxc",
                firstname: "xc",
                lastname: "z",
                email: "zxc@student.unimelb.edu.au"
            })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                should(res.status).equal(200);
                done();
            });
    });

    // #8 should sign up successfully
    // with a user that does exist
    it("should not sign up successfully", function(done) {
        server
            .post("/user/register")
            .send({
                username: "testfz",
                password: "testfz",
                firstname: "testfz",
                lastname: "testfz",
                email: "testfz"
            })
            .expect("Content-type", /json/)
            .expect(409)
            .end(function(err, res) {
                should(res.status).equal(409);
                done();
            });
    });
});
