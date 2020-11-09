import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
const fs = require('fs');
const path = require('path');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  app.get('/filteredimage?:image_url', async (request, response) => {
    const url = request.query.image_url;
    if (!url) {
      response.send('url required!');
    }

    if (url) {
      const image = await filterImageFromURL(url);
      await response.sendFile(image);
      
      setTimeout(() => {
        const fileList: Array<any> = [];
        const filePath = path.join(__dirname, 'util', 'tmp');
        fs.readdir(filePath, async (err:any, files:any) => {
          if (err) console.log('error reading files ', err);
          files.forEach((file:any) => {
            fileList.push(`${path.join(__dirname, 'util', 'tmp')}/${file}`);
          });
          await deleteLocalFiles(fileList);
        });
      }, 5000);
    }


  });

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();