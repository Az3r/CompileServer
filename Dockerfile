FROM node:12

WORKDIR /usr/src/app

# expose port
ENV PORT 8080
ENV HOST 0.0.0.0

COPY package*.json ./

# build app
RUN npm install --only=production

# Bundle app source
COPY . .

CMD npm start



