FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN echo '#!/bin/sh\n\necho "Running database migrations..."\nnpm run migration:run\n\necho "Starting application..."\nnpm run start:dev' > docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]