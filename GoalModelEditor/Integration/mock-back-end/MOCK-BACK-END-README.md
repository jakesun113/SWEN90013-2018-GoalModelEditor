# Goal Model Editor - Mock Back End

## Front-End Test Guide:

1. Launch the server by issuing `npm run start` from within /mock-back-end
   (by default, the server will be hosted on port 3000, you might need to
   change this by editing the DEFAULT\_PORT constant in server.js).
2. Change the URL of the back-end server in your front-end server script to    "http://localhost:\<WHATEVER\_YOU'VE\_SET\_AS\_THE\_PORT".
3. Lauch the front-end server.
4. Any requests sent from the front-end UI should be directed to the mock
   back-end server. The mock-back end should respond with HTTPS packets
   that faithfully simulate actual back-end data (though, obviously,
   everything will be hard-coded).

