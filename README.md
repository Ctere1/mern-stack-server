<h1 align="center">
  Mern Stack Chat App Server 
  <br>
</h1>

<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#installation-guide">Installation Guide</a> •
  <a href="#api">API Reference</a> •
  <a href="#license">License</a> •
  <a href="#contributors">Contributors</a> 
</p>

<div align="center">

![GitHub Repo stars](https://img.shields.io/github/stars/Ctere1/mern-stack-server?style=social)
![GitHub forks](https://img.shields.io/github/forks/Ctere1/mern-stack-server?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/Ctere1/mern-stack-server?style=social)

</div>

## ℹ️Introduction
Chat Application that you can chat with application's users using MERN STACK. 

Authentication process is performed using `OAuth 2.0`.

For Client Side see: https://github.com/Ctere1/mern-stack-client

## 💾Installation Guide

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/Ctere1/mern-stack-server
# Go into the repository
$ cd mern-stack-server
# Install dependencies
$ npm install
# Run the app
$ npm start
```

## ⚡API
> See Postman Collection Json for detailed information.

### **Authentication Endpoints**

| HTTP Verb   | Endpoint                    | Description                        |               
| :---------- | :-----------------------    |:---------------------------------- |              
| `POST`      | `api/auth/login`            |  User Login                        |  
| `DELETE`    | `api/auth/logout`           |  User Logout                       |     
| `POST`      | `api/auth/googleLogin`      |  Login with Google's Credentials   |     
| `POST`      | `api/auth/googleSignup`     |  User Login                        |  
| `POST`      | `api/auth/refreshToken`     |  For OAuth 2.0                     |  

### **User Endpoints**

| HTTP Verb   | Endpoint                    | Description                        |
| :---------- | :-----------------------    |:-------------------------------    |
| `POST`      | `api/user/signup`           | Creates User                       |
| `GET`       | `api/user/all`              | Returns Users                      |
| `DELETE`    | `api/user/delete`           | To delete a User                   |
| `PUT`       | `api/user/update`           | To update the User                 |
| `PUT`       | `api/user/referral`         | To update user's  point            |

### **Room Endpoint**

| HTTP Verb   | Endpoint                    | Description                        |
| :---------- | :------------------------   |:---------------------------------  |
| `GET`       | `api/room`                  |  Returns Rooms                     |


### 👤**User Data Example**

```json
{
   "_id": "63b06ea4afbce25ff3e6fe91",
   "createdAt": "2022-12-31",
   "name": "Test",
   "email": "test@gmail.com",
   "picture": "http://res.cloudinary.com/dyzuhnuw6/image/upload/v1672507041/xgiokrhmylqzwblq7hql.png",
   "status": "online",
   "points": 0,
   "referralCode": "gYSTs",
   "referralFromCode": "",
   "newMessages": {},
   "__v": 0
}
```

### 🏠**Room Data Example**

```json
[
    "general",
    "welcome",
    "events",
    "meeting"
]
```

### 🪪**Get Token Data Example**

```json
{
   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2CJleHAiOjE2NzI1OTEwNjF9.7M0htpNmxcgAJuAMC0E_tWn3FMvSgJi5qZ9lD0ZvsNY",
   "refreshToken": "eyJhbGciOiJIUI1NiIsInR5cCI6IkpXVCJ9.eyJ1cTYxLCJleHAiOjE2NzI1OTEzNjF9.kx0Cg8gIKc0by6o14zoVp0FRoWDcx0PI44wvfk0CNlk"
}
```

## 📝Credits

This software uses the following open source packages:

- [Express](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [Dotenv](https://github.com/motdotla/dotenv)
- [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs)
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [MongoDB](https://www.mongodb.com/)
- [Socket.io](https://socket.io/)

## ©License
![GitHub](https://img.shields.io/github/license/Ctere1/mern-stack-server)


## 📌Contributors

<a href="https://github.com/Ctere1/">
  <img src="https://contrib.rocks/image?repo=Ctere1/Ctere1" />
</a>

