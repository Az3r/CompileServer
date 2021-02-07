FROM openjdk:11

# setup env variables
ENV HOME /root
ENV NVM_DIR ${HOME}/.nvm
ENV NODE_VERSION 14.15.3
ENV DOTNET_DIR ${HOME}/.dotnet

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# install essential tools
RUN apt-get update
RUN apt-get -y install apt-utils curl software-properties-common build-essential

# install nodejs using nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash \
  && source $NVM_DIR/nvm.sh \
  && nvm install ${NODE_VERSION} \
  && nvm use ${NODE_VERSION}

# install dotnet sdk using scripts
WORKDIR /usr/src/scripts
ADD scripts ./
RUN ./dotnet-install.sh

# add to path if needed
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
ENV PATH      $HOME/.dotnet:$PATH

# install our express app
WORKDIR /usr/src/app

# expose port
ENV PORT 8080
ENV HOST 0.0.0.0

COPY package*.json ./


# build app
RUN npm run build

# Bundle app source
COPY . .

CMD npm start



