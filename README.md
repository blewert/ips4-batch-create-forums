# IPS4 Batch Forum Creation tool
This is a small tool created in NodeJS to batch create forums in an Invision Community forum. It makes use of the API exposed by the forum software, so you will need a valid API key and the base URL to your forum's API.

## Setting up
To set up, first clone the repository with `git clone`. You will also need to install `node` if you haven't already got it installed; I would recommend [nvm (Linux)](https://github.com/nvm-sh/nvm) or [nvm (Windows)](https://github.com/coreybutler/nvm-windows) for this purpose.

The first thing you will need to do is set up your `.env` file so it contains all the data needed to run correctly. An example is seen in example.env:

```sh
# The folder where config files are stored.
CONFIG_PATH=./config

# The base url for your installation. It should look something like:
# https://<your_forum_here>/forum/api/index.php
API_BASE_URL=

# Your API key to use. You can find this in the AdminCP under the 
# path System -> Site Features -> API -> REST API Keys.
API_KEY=

# The logging level
LOG_LEVEL=info
```

Once you have node installed, use `npm i` to install all the packages needed by the tool. You are then ready to go.

### An example setup
```sh
# Clone the repo
git clone https://github.com/blewert/ips4-batch-create-forums.git

# Install
cd ips4-batch-create-forums
npm i

# Run it
node src/index.js --folder data
```


## How the tool works
The tool looks for YAML files (`.yml` or `.yaml`) and creates forum according to the structure defined within. For example, if you wanted to create a forum `A` with subforum `B`, which has the forums `C` and `D` as children, the following yaml would define this relationship structure:

```yml
A:
    B:
    - C
    - D
```

The tool essentially follows this format. YML is used as it is human friendly, easy to edit, and can describe complex structures well. For example, here is an example forum structure taken from `data/example.yaml`:

```yaml
Forum 1:
  meta:
    description: Something here
    
  Subforum 1.1:
    - Forum nested 1
    - Forum nested 2
    - Forum nested 3

  Subforum 1.2:
    - Forum nested 1
    - Forum nested 2
    - Forum nested 3

Forum 2:
  Subforum 2.1:
    - a forum
    - a forum pt 2
```

Notice the inclusion of the `meta` key underneath `Forum 1`. This wouldn't create a forum called `meta`, but instead create `Forum 1` with the meta data (or whatever additional JSON data) provided. This way, you can create forums with a default description.

## Running the tool
The tool can be run in two modes: `folder` mode, or `file` mode. In `file` mode, a single yaml file is passed to be parsed. In folder mode, a directory full of yaml files is given, and the tool iterates over each. 

### File mode example
```sh
# This will iterate through the structure defined in something/blah.yaml and 
# insert forums accordingly
node src/index.js --file something/blah.yaml
```

### Folder mode example
```sh
# This will make the tool iterate over whatever yaml/yml files it finds in
# the folder "example-files" and insert each accordingly.
node src/index.js --folder example-files
```

# Version history
| Version | Date | Notes | 
|-----|-----|-----|
| `v0.0.1-a` | 24/08/23 | Prerelease: Basic repository |
| `v0.0.2-a` | 24/08/23 | Prerelease: Dry run working, both modes supported. Needs REST API interaction


