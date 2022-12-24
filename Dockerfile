###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:14.18.2-alpine3.12 As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json yarn.lock ./

RUN yarn install --only=development

COPY --chown=node:node . .

RUN yarn prisma generate

RUN yarn run build

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:14.18.2-alpine3.12 As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json yarn.lock ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn run build

RUN yarn install --only=production && yarn cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:14.18.2-alpine3.12 As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules

COPY --chown=node:node --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]