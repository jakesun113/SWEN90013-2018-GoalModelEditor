/*
    This is test for db functions
    All tests goals have been listed in the code
    Before test function
*/
let db = require("../dbConn");
const should = require("should");

describe("DBTesting", function() {
    // #1 test register function
    // with information do not exist
    it("should register successfully", function() {
        let username = "makemoretime";
        let password = "makemoretime";
        let email = "makemoretime";
        let firstname = "makemoretime";
        let lastname = "makemoretime";
        let promise = db.insertUser(
            username,
            password,
            email,
            firstname,
            lastname
        );
        return promise.then().should.be.fulfilledWith(db.SUCCESS);
    });

    // #2 test register function
    // with information do exist
    it("should inform user already exist", function() {
        let username = "testfz";
        let password = "newpassword";
        let email = "newemail";
        let firstname = "fname";
        let lastname = "lname";
        let promise = db.insertUser(
            username,
            password,
            email,
            firstname,
            lastname
        );
        return promise.then().should.be.rejectedWith(db.ALREADY_EXIST);
    });

    // #3 test login function
    // with information do exist
    it("should login successfully", function() {
        let username = "testfz";
        let password =
            "423007f36ebb07376fd098199988a810b8898a5b998f59562d978d668312db62";
        let promise = db.login(username, password);
        return promise.then().should.be.fulfilled();
    });

    // #4 test login function
    // with information do not exist
    it("should be denied to access", function() {
        let username = "doesnotexist";
        let password = "doesnotexist";
        let promise = db.login(username, password);
        return promise.then().should.be.rejected();
    });

    // #5 test create_project function
    // with information do not exist
    it("should create project successfully", function() {
        let name = "testproj";
        let desc = "thisisdesc";
        let size = "5";
        let userid = "97c65b40-4e14-11e8-8c21-02388973fed8";
        let promise = db.createProject(name, desc, size, userid);
        return promise.then().should.be.fulfilled();
    });

    // #6 test create_project function
    // with information do exist
    it("should inform project already exists", function() {
        let name = "testproj";
        let desc = "differentdesc";
        let size = "5";
        let userid = "97c65b40-4e14-11e8-8c21-02388973fed8";
        let promise = db.createProject(name, desc, size, userid);
        return promise.then().should.be.rejectedWith(db.ALREADY_EXIST);
    });

    // #7 test get_goalmodel_list function
    // with information do exist
    it("should read goalmodel list successfully", function() {
        let projectid = "342a5855-533d-11e8-8c21-02388973fed8";
        let promise = db.getGoalModelList(projectid);
        return promise.then().should.be.fulfilled();
    });

    // #8 test get_goalmodel_list function
    // with information do not exist
    it("should return an empty array", function() {
        let projectid = "x";
        let promise = db.getGoalModelList(projectid);
        return promise.then().should.be.fulfilledWith([]);
    });

    // #9 test create_goalmodel function
    // with information do not exist
    it("should create goalmodel successfully", function() {
        let name = "testgm";
        let desc = "thisisdesc";
        let url = "/testfz";
        let projectid = "342a5855-533d-11e8-8c21-02388973fed8";
        let promise = db.createGoalModel(name, desc, url, projectid);
        return promise.then().should.be.fulfilled();
    });

    // #10 test create_goalmodel function
    // with information do exist
    it("should inform goalmodel already exists", function() {
        let name = "testgm";
        let desc = "thisisdesc";
        let url = "/anotherfz";
        let projectid = "342a5855-533d-11e8-8c21-02388973fed8";
        let promise = db.createGoalModel(name, desc, url, projectid);
        return promise.then().should.be.rejectedWith(db.ALREADY_EXIST);
    });

    // #11 test get_project_list function
    // with information do exist
    it("should read project list successfully", function() {
        let userid = "97c65b40-4e14-11e8-8c21-02388973fed8";
        let promise = db.getProjectGoalModelList(userid);
        return promise.then().should.be.fulfilled();
    });

    // #12 test get_project_list function
    // with information do not exist
    it("should return an empty array", function() {
        let userid = "x";
        let promise = db.getProjectGoalModelList(userid);
        return promise.then().should.be.fulfilledWith([]);
    });

    //process.exit();
});
