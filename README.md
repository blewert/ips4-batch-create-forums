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


## Permission sets
Another thing this tool allows you to do is to specify a collection of "permission sets", which can be applied to the forums listed in the YML data. These specify what users can perform certain actions on the target forum; namely if they can *read*, *view*, *reply* and *attach* (key: attachments). The created forums will then be created using the specified permission set. For example, you could have the two permission sets:

```yml
adminOnly:
  view: 4
  read: 4
  reply: 4
  attachments: 4

regularUsersCanOnlyView:
  view: 4,2,1
  read: 4,2,1
  reply: 4
  attachments: 4
```

In `adminOnly`, only the group id `4` (could be anything, but in this case we'll assume its an admin) can perform all four actions. In `regularUsersCanOnlyView`, only admins (`4`) and users in group IDs `2` or `1` can view and read. However, only admins (`4`) can reply or attach things.

You could then specify a forum in one of the yaml files to parse, by using angled brackets after the name. Using our two previously created permission sets, we can use it on a forum like so:

```yaml
Pizza:
  Cooking:
    Recipes <regularUsersCanOnlyView>:
      - Hawaiian <regularUsersCanOnlyView>
      - Meat feast <regularUsersCanOnlyView>

Admin Portal <adminOnly>:
  - Reports <adminOnly>
```

Here, the `Recipes`, `Hawaiian` and `Meat feast` forums will have the permissions set according to the `regularUsersCanOnlyView` permissions set. Equally, the `Admin Portal` and `Reports` forums will have their permissions set to whatever is in the `adminOnly` set.

### Reserved names
There are three reserved names which can be used in your permissions yml file. The first is `default`, which specifies a default permission set to apply to nodes if none is found in the name. This can be used to save yourself the effort of typing out names if you only want to apply one permission set across all created forums. For example, if we had the forums:

```yml
Cool forum:
  Discussion:
    - Something
    - Something else
    - Blah
  Competitions:
    - Blah
    - Something
  
Admin Portal <adminOnly>:
  - Reports <adminOnly>
```

The `default` permission set would apply to the following forums:

```yml
Cool forum:               # ✔ <default>
  Discussion:             # ✔ <default>
    - Something           # ✔ <default>
    - Something else      # ✔ <default>
    - Blah                # ✔ <default>
  Competitions:           # ✔ <default>
    - Blah                # ✔ <default>
    - Something           # ✔ <default>
  
Admin Portal <adminOnly>: # ❌ <adminOnly>
  - Reports <adminOnly>   # ❌ <adminOnly>
```

-----

The final two are `leaves` and `nodes`. The permission set `leaves` specifies what permissions should be applied by default to "leaf" or terminal nodes of the parsed yml. These will be the "deepest" subforums. The opposite are non-terminal nodes, which is what the `nodes` set targets.

For example, the following structure shows what sets apply to each node in the tree:

```yml
A:          # <nodes>
  AB:       # <nodes>
    ABC:    # <nodes>
      - D   # <leaves>
      - E   # <leaves>
      - F   # <leaves>
            
  CD:       # <nodes>
    - E     # <leaves>
    - F     # <leaves>
            
  G:        # <nodes>
    - H     # <leaves>
I:          # <nodes>
  - J       # <leaves>
```


# Version history
| Version | Date | Notes | 
|-----|-----|-----|
| `v0.0.1-a` | 24/08/23 | Prerelease: Basic repository |
| `v0.0.2-a` | 24/08/23 | Prerelease: Dry run working, both modes supported. Needs REST API interaction
| `v0.0.3-a` | 24/08/23 | Prerelease: Added interactive mode and CLI argument overrides
| `v0.0.4-a` | 25/08/23 | Prerelease: Basic permission sets
| `v0.1.0` | 26/08/23 | First working version


# To-do
| Action | Urgency  |
|--------|----------|
| Documentation of code | Low
| Create system for categories/non-category forum creation | Medium
| Add `--dryRun` to `-i` | Low

