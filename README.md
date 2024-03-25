# Gurbi (under development)
Gurbi is a platform designed for students, by students. It is a place where student organisations can easily
manage their members and post events and announcements for everyone to see. Students are able to buy
tickets (either free or you can set a price) to events which allows the event host to easily keep track of the
attendance list and who has paid or not.

## Requirements
* Node.js
* MongoDB

## Installation & Running
1. Install MongoDB (i.e. `paru -S mongodb-bin` from AUR if you are on Arch. Note: ensure the service is enabled and running.)
1. Run `npm install` in both the `client` and the `server` directories.
1. Run `npm run dev` in the `server` directory to start the server and `npm start` in the `client` directory to start the client.
