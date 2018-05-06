/* End-point for Goal Model related HTTP requests in back-end REST API
 *
 */


const express = require("express");
const router = express.Router();


/* POST Create Goal Model */
router.post("/create/:userId-:projectId-:goalmodelId",
    (req, res, next) => {
        // stub
    }
);


/* PUT Edit Goal Model */
router.post("/edit/:userId-:projectId-:goalmodelId",
    (req, res, next) => {
        // stub
    }
);


/* DELETE Goal Model */
router.delete("/delete/:userId-:projectId-:goalmodelId",
    (req, res, next) => {
        // stub
    }
);

module.exports = router;
