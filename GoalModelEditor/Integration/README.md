# Goal Model Editor Integration Layer (DRAFT)

## Primary Purpose: Integration

The integration layer defines the interaction between the front-end and
back-end servers for the GME application. Specifically, it defines the
HTTPS GET and POST request that the front-end might send to the back-end to:
    
    * Query or upate user information (e.g. registration, login, editing
      user profile); and
    * Creating and updating goal models (e.g. loading goal model files,
      saving changes made to goal model files).

## Method


## Secondary Purpose: Isolated Testing

The secondary function of the scripts provided in this directory is to
provide:
    1. A simple mock implementation of back-end functionality which the
       front-end team can use for testing; and
    2. A suite of HTTPS requests simulating front-end functionality, which
       the back-end team can use both (a) for testing, and (b) to inform
       the topology of the RESTful API routing system.
