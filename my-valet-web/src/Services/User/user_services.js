import axios from "axios"

const Environments = {
	docker: "user-server",
	local: "localhost",
	aws: "15.236.216.34",
	currentEnvironment: window.location.hostname
}

const currentEnvironment = Environments.currentEnvironment

async function getUserInfo(userData) {
	
	let promise = new Promise((resolve, reject) => {
		axios.post(`http://${currentEnvironment}:8889/user/get_user_info`, userData)
        .then((res) => {  
			resolve(res.data)})
		.catch((res) => {
			reject(res.data)})
	})
	
	let result = await promise
	return result
}

async function getParkingData(parkingId) {
	
	let promise = new Promise((resolve, reject) => {
		axios.post(`http://${currentEnvironment}:8889/parking/get_parking_data`, parkingId)
        .then((res) => {  
			resolve(res.data)})
		.catch((res) => {
			reject(res.data)})
	})
	
	let result = await promise
	return result
}

async function getNewParkingSpot(userData) {
	
	let promise = new Promise((resolve, reject) => {
		axios.post(`http://${currentEnvironment}:8889/parking/get_new_parking_spot`, userData)
        .then((res) => {  
			resolve(res.data)})
		.catch((res) => {
			reject(res.data)})
	})
	
	let result = await promise
	return result
}

async function occupyParking(userData) {
	
	let promise = new Promise((resolve, reject) => {
		axios.post(`http://${currentEnvironment}:8889/parking/occupy_parking`, userData)
        .then((res) => {  
			resolve(res.data)})
		.catch((res) => {
			reject(res.data)})
	})
	
	let result = await promise
	return result
}

async function freeParking(userData) {
	
	let promise = new Promise((resolve, reject) => {
		axios.post(`http://${currentEnvironment}:8889/parking/free_parking`, userData)
        .then((res) => {  
			resolve(res.data)})
		.catch((res) => {
			reject(res.data)})
	})
	
	let result = await promise
	return result
}

async function addExistingParking(userData) {
	
	let promise = new Promise((resolve, reject) => {
		axios.post(`http://${currentEnvironment}:8889/parking/add_existing_parking_spot`, userData)
        .then((res) => {  
			resolve(res.data)})
		.catch((res) => {
			reject(res.data)})
	})
	
	let result = await promise
	return result
}
export default {
	getUserInfo,
	getParkingData,
	getNewParkingSpot,
	occupyParking,
	freeParking,
	addExistingParking
}

