# My-Valet-user


My-Valet-user is a docker project that will deploy in seconds a user/register system with Node.js and MongoDB so you can use it for your projects.

In order to acces this user Api the endpoint should be:
- http://user:8888

You can search more of my My-Valets docker projects and try to combine them in order to create a complete backend for your apps.
  - My-Valet-IOs
  - My-Valet-user
  - My-Valet-web

### API use

Down here you have example code for the events that this server provides:

#### user

```js
function logUser() { 
	let userData = {
		username: "client's username",
		password: "client's password"
	}

	$ axios.post("https://yourNetworkPath:8888/user/log_user", userData)
	   	   .then((res) => console.log(res))
}
```

#### Register

```js
function registerUser() {
	let userData = {
		username: "client's username",
		password: "client's password",
		passwordConfirmation: "client's confirmation password",
		group: "admin" // defaults in "user"
	}

	axios.post("https://yourNetworkPath:8888/register/register_user", userData)
	     .then((res) => console.log(res))
}
```

#### Logout
```js
function logoutUser() {
	let userData = {
		username: "client's username",
		password :"client's password"
	}

	$ axios.post("https://yourNetworkPath:8888/logout/logout_user", userData)
		   .then((res) => console.log(res))
}
```

#### User status

```js

function checkUserStatus() {
	let userData = {
		username: "client's username",
		password :"client's password"
	}

	$ axios.post("https://yourNetworkPath:8888/status/user_status", userData)
		   .then((res) => console.log(res))
}

```

### Tech

My-Valet-user uses a number of open source projects to work properly:

* [node.js] - Evented I/O for the backend
* [Express] - Fast node.js network app framework 
* [MongoDB] - Classified as a NoSQL database program

### Installation

My-Valet-user requires [Docker](https://www.docker.com/) to run.

If you have Docker already installed in your pc, then proceed with this commands:

```sh
$ git clone https://github.com/headStyleColorRed/My-Valet-user.git
$ cd My-Valet-user
$ docker-compose up --build -d
```

For personal environments you may want to run

```js
$ npm run dev
// Instead of :
$ npm start
```

### Todos

 - Add testing
 - Add Load Balancer
 - Add Oauth
 - Add Recovery

License
----

MIT


**Free Software, Hell Yeah!**