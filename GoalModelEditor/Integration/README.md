# Goal Model Editor Integration Layer (DRAFT)

## Primary Purpose: Integration

The integration layer defines the interaction between the front-end and
back-end servers for the GME application. Specifically, it defines the
HTTPS GET and POST request that the front-end might send to the back-end to:
    
    * Query or upate user information (e.g. registration, login, editing
      user profile); and
    * Creating and updating goal models (e.g. loading goal model files,
      saving changes made to goal model files).

## Instructions for Use

The mock implementation of the FRONT-END should guide:
    1. The BACK-END team on the type of requests that can must be serviced
       for the front-end;
    2. The BACK-END team on the format of JSON requests received from the
       front-end by the back-end RESTful API;
    3. The BACK-END team on the format of JSON responses returned to the
       front-end in response to particular requests (if actual response
       format is compared to the expected response format) [this isn't
       implemented yet].
    4. The FRONT-END (/INTEGRATION) team onthe format of JSON requests
       that should be sent to the back-end.

The mock implementation of the BACK-END should guide:
    1. The BACK-END team on the format of JSON responses sent back to the
       front-end;
    2. The BACK-END team on the structure of the routing system used by
       the RESTful API; and
    3. The FRONT-END (/INTEGRATION) team on the format of JSON responses
       received from the back-end.

## Secondary Purpose: Isolated Testing

The secondary function of the scripts provided in this directory is to
provide:
    1. A simple mock implementation of back-end functionality which the
       front-end team can use for testing; and
    2. A suite of HTTPS requests simulating front-end functionality, which
       the back-end team can use both (a) for testing, and (b) to inform
       the topology of the RESTful API routing system.
