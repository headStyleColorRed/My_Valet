<template>
  <div class="home">
    <div v-show="isLoaded" class="homeWrapper">
      <div v-if="userHasParking" class="topPart">
        <div class="topPartData">
          <input id="copyfrom" tabindex="-1" aria-hidden="true" />
          <h1 :style="statusColor">{{isOcuppied ? Strings.taken : Strings.free}}</h1>
          <p v-if="isOcuppied">@{{parking.userOccupant}}</p>
          <p class="parkingIdWrapper">
            Parking id:
            <span class="parkingId" v-on:click="copyToClipBoard()">{{parkingId}}</span>
          </p>
        </div>
      </div>
      <div v-if="userHasParking" class="bottomPart">
        <hr />
        <div class="buttonWrapper">
          <div v-if="shouldShowOccupancyButton" v-on:click="handleParkingRequest()" class="buttonContainer">
            <p v-if="!isOcuppied" class="buttonText">{{Strings.occupyParking}}</p>
            <p v-else class="buttonText">{{Strings.freeParking}}</p>
          </div>
        </div>
      </div>
      <div v-else class="bottomPartDataNoParking">
        <p class="bottomPartDataNoParking-text">
          {{Strings.hello}} {{username}} {{Strings.userHasNoParking1}}
          <span
            class="greenText"
          >get a new spot</span>
        </p>
        <div class="buttonWrapperNewParking">
          <div v-on:click="getNewParkingSpot()" class="buttonContainerNewParking">
            <p class="buttonTextNewParking">{{Strings.getNewParkingSpot}}</p>
          </div>
        </div>
        <br />
        <p class="bottomPartDataNoParking-text">{{Strings.userHasNoParking2}}</p>
        <v-text-field
          class="newParkingIdTextField"
          name="name"
          single-line
          placeholder="Paste here the parking Id"
          v-model="newParkingId"
        ></v-text-field>
        <div class="buttonWrapperNewParking">
          <div v-on:click="addExistingParking()" class="buttonContainer">
            <p class="buttonTextNewParking">{{Strings.registerExistingParking}}</p>
          </div>
        </div>
      </div>
    </div>
	<div class="logOutIcon">
		<v-icon v-on:click="logout()">login</v-icon>
	</div>
  </div>
</template>

<script>
import stringsImport from "../assets/Strings_en.json";
import user_services from "../Services/User/user_services.js";
import login_services from "../Services/Login/login_services.js";

export default {
  name: "Home",
  data() {
    return {
      isLoaded: false,
	  isOcuppied: false,
	  isOccupiedByThisUser: false,
      Strings: new Object(),
      username: "",
      userHasParking: false,
      parking: new Object(),
      userData: new Object(),
      newParkingId: null
    };
  },
  mounted() {
    this.Strings = stringsImport.screen_home;
    this.username = this.$store.getters.username;
    this.getUserData();
  },
  methods: {
    getUserData() {
	  let userEmail = this.$store.getters.email
	  if (!userEmail) return;

      console.log("Getting user data");
      this.isLoaded = false;

      user_services
        .getUserInfo({ email: userEmail })
        .then(res => {
          this.userData = res.status;
          console.log("User data retrieved succesfully");
          console.log(res);
          this.getParkingData();
          this.isLoaded = true;
        })
        .catch(err => {
          console.log("User data retreival went wrong");
          console.log(err);
          this.isLoaded = true;
        });
    },
    getParkingData() {
      if (this.parkingId == "none") {
        this.userHasParking = false;
        console.log("User has no parking");
        return;
	  }
	  
      console.log("Getting parking data");
      this.userHasParking = true;
      this.isLoaded = false;

      user_services
        .getParkingData({ parkingId: this.parkingId })
        .then(res => {
		  this.parking = res.data;
		
          console.log("Getting parking Data succesfull");
          console.log(res);
		  this.isOcuppied = res.data.isParkingTaken ? true : false;
		  this.isOccupiedByThisUser = res.data.userOccupant == this.username ? true : false;
		  console.log("user ocuppant: " + res.data.userOccupant);
          this.isLoaded = true;
        })
        .catch(err => {
          console.log("Parking data retreival went wrong");
          console.log(err);
          this.isLoaded = true;
        });
    },
    getNewParkingSpot() {
      let userEmail = this.$store.getters.email;
	  if (!userEmail) return;
	  
      this.isLoaded = false;
      user_services
        .getNewParkingSpot({ email: userEmail })
        .then(res => {
          this.getUserData();
          console.log("User got new parking with Id: ");
          console.log(res);
        })
        .catch(err => {
          this.isLoaded = true;
          console.log("Error getting new Parking");
          console.log(err);
        });
    },
    copyToClipBoard() {
      /* Get the text field */
      var copyText = this.parkingId;

      document.getElementById("copyfrom").value = copyText;
      let justForCopy = document.getElementById("copyfrom");
      justForCopy.select();

      document.execCommand("copy");

      alert("Copied the text: " + copyText);
    },
    occupyParking() {
	  this.isLoaded = false;
	  
      let userData = {
        username: this.username,
        parkingId: this.parkingId
      };

      user_services
        .occupyParking(userData)
        .then(res => {
          console.log(res);
          this.getParkingData();
          this.isOcuppied = true;
          this.isLoaded = true;
        })
        .catch(err => {
          console.log(err);
          this.isLoaded = true;
        });
    },
    freeParking() {
	  this.isLoaded = false;
	  
	  let userData = {
		  parkingId: this.parkingId,
		  username:  this.$store.getters.username
	  }

      user_services
        .freeParking(userData)
        .then(res => {
          console.log(res);
          this.getParkingData();
          this.isOcuppied = false;
          this.isLoaded = true;
        })
        .catch(err => {
          console.log(err);
          this.isLoaded = true;
        });
    },
    addExistingParking() {
      if (!this.newParkingId || this.newParkingId.length < 5) return;
      this.isLoaded = false;
 
      let userData = {
        email: this.$store.getters.email,
        parkingId: this.newParkingId
      };

      user_services
        .addExistingParking(userData)
        .then(res => {
          if (res.code == "200") {
			  this.getUserData()
		  }
          else {
            this.isLoaded = true;
            alert("this parking doesnt exist");
          }
        })
        .catch(err => {
          console.log(err);
          this.isLoaded = true;
        });
    },
    handleParkingRequest() {
      this.isOcuppied ? this.freeParking() : this.occupyParking();
	},
	logout() {
		console.log("entar");
		login_services
        .logOut({ email: this.$store.getters.email })
        .then(res => {
			console.log(res);
			this.$store.commit("resetAuthState")
			this.$router.push("/login")
        })
        .catch(err => {
          console.log("Logout went wrong");
          console.log(err);
        });
	}
  },
  components: {},
  computed: {
    parkingId() {
      let cleanId = this.userData.parkingSpot.replace("-", "");
      return cleanId;
    },
    statusColor() {
      return this.isOcuppied ? "color: #bf0000" : "color: #3d6e05";
	},
	shouldShowOccupancyButton() {
		if (this.isOcuppied && !this.isOccupiedByThisUser){
			console.log(false);
			return false
		} 
		console.log("true");
		return true
	}
  }
};
</script>

<style scoped>
.home {
  height: 100vh;
  width: 100vw;
}

.logOutIcon {
	position: absolute;
	top: 10px;
	right: 10px;
}

.homeWrapper {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: 1fr 2fr;
}

#copyfrom {
  position: absolute;
  left: -9999px;
}

.topPart {
  display: grid;
}

.topPartData {
  display: grid;
  padding-top: 2rem;
  text-align: center;
}

.parkingId {
  text-decoration: underline;
}

/* 	 B O T T O M	 */
.bottomPart {
  display: grid;
  grid-template-rows: 0.3fr 1fr;
}

.buttonWrapper {
  display: grid;
}

.buttonContainer {
  display: grid;
  position: relative;
  justify-self: center;
  background-color: rgb(39, 38, 38);
  color: white;
  margin-top: 2rem;
  height: 3.4rem;
  width: 15rem;
  border-radius: 5rem;
  cursor: pointer;
}

.buttonText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 	 N O	P A R K I N G	 */

.buttonWrapperNewParking {
  display: grid;
}
.buttonContainerNewParking {
  display: grid;
  position: relative;
  justify-self: center;
  background-color: #3d6e05;
  color: white;
  margin-top: 2rem;
  height: 3.4rem;
  width: 15rem;
  border-radius: 5rem;
  cursor: pointer;
}
.buttonTextNewParking {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.bottomPartDataNoParking {
  padding-top: 2rem;
  text-align: center;
  display: grid;
}

.newParkingIdTextField {
  margin: 0 2rem;
}

.bottomPartDataNoParking-text {
  margin: 2rem;
}

.greenText {
  color: #3d6e05;
  font-weight: 1000;
}
</style>
