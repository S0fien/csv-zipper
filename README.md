# csv-zipper

### Docker
You can use docker to run the app locally:
  ` docker-compose up -d`

## Consignes
### Front (React)
Create a simple React interface with a single page containing a CSV file upload form.
Display a progress indicator during the file upload.
Manage upload errors by displaying an appropriate error message.
- To run :
  ` cd front && yarn run dev`
- To test (react-testing-library + vitest) :
  ` cd front && yarn run test`
### Back (Node.js)
Set up a Node.js API with a route to receive the CSV file.
The route should be capable of efficiently handling a CSV file.
The file should be separated into two CSV files based on gender.
The result must be compressed (zipped) before being sent back to the client.
Manage errors.

The sample CSV file is available at that [link](https://drive.google.com/file/d/1MG0MoczOYM-UoFsEQN8ThRyyG3aH4v4Y/view?usp=sharing): https://drive.google.com/file/d/1MG0MoczOYM-UoFsEQN8ThRyyG3aH4v4Y/view?usp=sharing)

- To run :
  ` cd back && yarn run dev`
### Evaluation Criteria
Complete and correct functionality. Good practices, code clarity, and organization. Clear and concise documentation. Proper error handling, code scalability... Any additional content/remarks will be appreciated.

### Dependancies
Use as few dependencies as possible
* **antd design**
* react-testing-library
* vitest + vite
* archiver
* multer
* fast-csv