# Setting Up the Development Environment

1. Download and install WebStorm (https://www.jetbrains.com/webstorm/download/) - this is the IDE we recommend using for development.
2. Make sure that Node.js is installed on your machine - for MacOS users, just type `brew install nodejs`
3. Clone this repository into your local machine with the usual `git clone <repo url>` command
4. Open the /GoalModelEditor subdirectory as a New Project in Webstorm.
5. We need to specify the system path to the node binary for the IDE. Within the editor, go to Run -> Edit Configurations. Go to the Configuration tab. Set "Node interpreter" to the absolute path to the node binary (default location for MacOS is "/usr/local/bin/node")
6. Test that everything's working by running the "www" file, then go to "localhost:3000" in your web-browser.
