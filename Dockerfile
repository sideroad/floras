FROM node:10-alpine
WORKDIR /root/
COPY src /root/src
COPY static /root/static
COPY i18n /root/i18n
COPY *.json /root/

ENV GLOBAL_HOST floras.now.sh
ENV GLOBAL_PORT 443
ENV KOIKI_FLORAS_FLICKR_API_KEY 465feed45e22a43227d848adb72ae150
ENV KOIKI_FLORAS_GOOGLE_API_KEY AIzaSyD-cN8kJmyaYkxOfYfda-MC4Llb62LpMOE
ENV KOIKI_FLORAS_MAPBOX_TOKEN pk.eyJ1Ijoic2lkZXJvYWQiLCJhIjoiY2l5ems4dHB0MDQyczJxcDh3Nmhjc2h3eCJ9.4vItskqhevUMLJv2ogNdlA
ENV NODE_ENV production
ENV NODE_PATH ./src
ENV NPM_CONFIG_PRODUCTION false
RUN npm i --unsafe-perm --production
EXPOSE 3000
CMD ["npm", "start"]
