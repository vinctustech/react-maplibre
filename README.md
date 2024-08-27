## react-maplibre

**react-maplibre** is a very minimalist React.js wrapper library for the 
[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/) 
Typescript library.

Documentation can be found [here](https://vinctustech.github.io/react-maplibre/).

Testing
-------
There is a test program in the `test` directory. It gets the Mapbox access token from environment variable
`REACT_APP_MAPBOX_API_KEY` in `.env.development`, which can be decrypted using the usual encryption key.

To start the test program type:
1. ```bash
   npm i
   ```
2. ```bash
   tsc
   ```
3. ```bash
   cd test
   ```
4. ```bash
   npm i
   ```
5. ```bash
   npm start
   ```
