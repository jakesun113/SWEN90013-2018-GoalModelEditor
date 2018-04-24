GoalModelEditor
================================
##### Project Structure

 - src
   - basicVO 
   - JointVO
   - services
   - servlets
   - test
   - utils
 - libs
 - WebContent
    -  Images
    -  scripts
    -  WEB-INF
        -  lib
        -  web.xml
    -  Help.html, index.html
##### Descritions
Back-end
- *src* ---------- contains all source code of back-end
- *basicVO* ---- contains all value objects for BasicJSON object. The BasicJSON describes the goal model's information and structure. After building the object, it can be converted to JSON by Gson library.
- *JointVO* ---- contains all value objects for graph object. Then this object can be convert to JSON by Gson library.
- *services* ---- contains one service which will generete the graph object according the information and stucture of BasicJSON object. It will also calculate the position of every element and generate text.
- *servlets* ----- contains all the servlets of the projects.
- *test* ---------- contains test files of the project.
- *utils* --------- contains ID generator util.
- *libs* ---------- contains all the libraries which have been used in the project.

Front-end
- *WebContent* ---- contains all front-end files and codes.
- *Images* -- images which have been use in the page.
- *scripts* -- javascript and css files for front html page.
- *WEB-INF* -- web configuration
- *lib* -- all librarys used in the back-end project.
- *Help.html, index.html* -- Html page of the project.

###### Deployment
The deployment mamual has been uploaded in confluence.