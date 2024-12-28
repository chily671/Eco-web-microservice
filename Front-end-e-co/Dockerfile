FROM node

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=none
# RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]