FROM node:20.13.1-bullseye

ARG BACK_NAME
ARG BACK_PORT

WORKDIR .

ENV BACK_NAME=${BACK_NAME}
ENV BACK_PORT=${BACK_PORT}

COPY . .

RUN [ "npm","i" ] 

ENTRYPOINT [ "npm","run","start" ]