# bigArchiMate

## Getting started

Please install all necessary [prerequisites](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites) on your system.

For detailed instructions for a Windows machine, follow [this](./docs/PrerequisitesWindows..md) guide.

## Installing the application dependencies

    yarn

## Running the application

### Electron (desktop application)

This will build and start bigArchiMate as a native desktop application for the OS (Windows, Linux or MacOS) where the command is started.

    yarn build:electron &&
    yarn start:electron

### Browser

This will build and start bigArchiMate as a web application. When the web application is running you can open <http://localhost:3000> in your browser to use bigArchiMate.

    yarn build:browser &&
    yarn start:browser

## Example ArchiMate Models

Under `examples` we provide an example workspace with some demo ArchiMate models containing elements, relations, junctions and diagrams.
Each package represents a dedicated ArchiMate model and may depend on other packages.

## Developing

Start watching all packages of your application for either browser or electron version.

    yarn watch:browser

_or_

    yarn watch:electron

_or_ watch only specific packages with

    cd packages/<package-name>
    yarn watch

and the Electron example.

    cd applications/electron-app
    yarn watch

Run the example as [described above](#running-the-application).

Any code changes will be automatically detected and the application will be re-compiled.
If you only made changes to the frontend or plugins, simply reloading the running application with `F5` is enough.
If you also made changes to the backend, you can close and restart the application without manual re-compilation.

### Developing in Dev Container

You can work on bigArchiMate from within a Dev Container. The best way to do so is create a new Dev Container and cloning the repository in there. For instructions please consult [this](https://code.visualstudio.com/docs/devcontainers/containers#_quick-start-open-a-git-repository-or-github-pr-in-an-isolated-container-volume) page.

Short steps:

1. Install Docker with WSL 2 engine enabled.
1. In VS Code press [CTRL] + [SHIFT] + [P] and type 'Dev Container: Clone Repository in Container Volume...' and press [Enter].
1. Enter the current repository URL and press [Enter]. Now the dev container will be created with the Git repository cloned in it (faster then cloned locally in Windows).

## Packaging

We package bigArchiMate either for the browser (Docker) or desktop application (Electron).

### Docker

To package the web application we build a docker image. There are currently two Dockerfile definitions, one based on [Alpine Linux](./Dockerfile) and one based on [Debian](./Dockerfile.debian). Some users might prefer Debian over Alpine as based, which is why we have both options.

To create the Alpine based image, execute the following command:

    docker build -t big-archimate:0.0.0-alpine -f .\Dockerfile .

To create the Debian based image, execute the following command:

    docker build -t big-archimate:0.0.0-debian -f .\Dockerfile.debian .

In the main build action we build and publish the Alpine version.

### Electron

To package bigArchiMate as a desktop application, execute the following command:

    yarn theia:electron package

Depending on the platform, this will produce an executable or an installer for the application under `applications/electron-app/dist`.

Details about the packaging can be configured in `applications/electron-app/electron-builder.yml`.

## Structure

A general overview of the application architecture is provided in the [Architecture Overview](docs/Architecture.md).
The repository itself contains the following components structured as follows:

    ├── applications
    │   ├── browser-app              # Browser application
    │   └── electron-app             # Electron application
    ├── configs
    ├── docs                         # Documentation
    ├── e2e-tests                    # Playwright End-To-End-Tests
    ├── examples                     # ArchiMate Model examples
    ├── extensions                   # VS Code extensions
    │   └── big-archimate-lang          # bigArchiMate language support (through three servers)
    │       └── src
    │           ├── glsp-server      # Graphical modelling server based on GLSP
    │           ├── language-server  # Textual modelling server based on Langium
    │           ├── model-server     # Custom model server to provide access to the semantic models
    │           ├── extension.ts     # Extension starting the server process and the language client
    │           └── main.ts          # Server process starting up all servers
    │   └── big-archimate-theme      # bigArchiMate Theia theme
    └── packages                     # Theia extensions
            ├── core                 # Core customizations
            ├── form-client          # Form editor widget connecting to the model server
            ├── glsp-client          # Diagram configuration and widget using the GLSP server
            └── product              # Application-level modifications

## Used libraries and license

-  mui-x : MUI X is open core—base components are MIT-licensed, while more advanced features require a Pro or Premium commercial license. We are currently only using core-base
-  react-tabs: MIT
-  chevrotain: This library is a dependency of langium. To get the Yaml language working in bigArchiMate an example implementation of the python language of chevrotain has been used. This example has been modified to make it work for the yaml language.
   -  <https://github.com/Chevrotain/chevrotain>
   -  example that has been used: <https://github.com/Chevrotain/chevrotain/tree/master/examples/lexer/python_indentation>
