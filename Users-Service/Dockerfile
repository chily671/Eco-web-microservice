FROM node

WORKDIR /app/user


COPY package.json package-lock.json ./

RUN npm install 

COPY . .

EXPOSE 5001

CMD ["npm", "start"]