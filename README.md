# po-concept

- to run the app, import the given data (./mock_data) to mongodb compass (collections: ports,vessels)
- local mongodb service url should be provided to app in .env file (DATABASE_URL=)
- the service layer and the controller layer are seperated from each other.

the flow:

- search for the selected port
- get the RoI maximum and minimum limits of the selected port
- find ports in the Region of Interest
- find vessels headed to the selected port and alternative ports
- get the idle vessels waiting near these ports (./config/globals IDLE_DISTANCE)
- return the data
