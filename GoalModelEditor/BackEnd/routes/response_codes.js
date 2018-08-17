/* Response Codes
 *
 * Standard codes/messages for responding to HTTP(S) requests.
 */
"use strict";

module.exports = {
    VALID: {
        RESOURCE_RETREIVED: 200,
        RESOURCE_CREATED: 201
    },

    ERROR: {
        UNAUTHORIZED_REQUEST: 401,
        RESOURCE_NOT_FOUND: 404,
        TIMEOUT: 408
    }
};
