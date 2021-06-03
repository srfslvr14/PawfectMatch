  // import { Client } from "@petfinder/petfinder-js";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

// curl -d "grant_type=client_credentials&client_id={'nRVIaz6AEO2qZ6DCKXDKcw3EX4zRxbjKz64UQDFheRh5VBdAIE'}&client_secret={'obAhKvjIzSik0WT6T7yrMTkKYQcsSUj8nktFxGJF'}" https://api.petfinder.com/v2/oauth2/token

// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

	// This is the Vue data.
	app.data = {
		cur_email: "",
		email: "",
		phone: "",
		breed: "",
		age: "",
		gender: "",
		size: "",
		fur: "",
		potty: "",
		kid: "",
    location:"",
    distance:"",
	};

	// i dont think i need this for this page
	// app.enumerate = (pup_cards) => {
	// 	let k = 0;
	// 	pup_cards.map((pup) => {
	// 		pup._idx = k++;
	// 	});
	// };

	// We form the dictionary of all methods, so we can assign them
	// to the Vue app in a single blow.
	app.methods = {
		// enumerate: app.enumerate,
		
	};

	// This creates the Vue instance.
	app.vue = new Vue({
		el: "#vue-profile",
		data: app.data,
		methods: app.methods,
	});


	// And this initializes it.
	// This is where im going to pull current_pup_cards from the data base
	// and then set all their values up, and then set up each cards data
	// make sure to call get_next_pupcards if needed
	app.init = () => {
		console.log("init");
		// axios.get(_______).then(function(response){});
	};


	// Call to the initializer.
	app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
