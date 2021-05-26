// // import { Client } from "@petfinder/petfinder-js";

// // This will be the object that will contain the Vue attributes
// // and be used to initialize it.
// let app = {};

// // curl -d "grant_type=client_credentials&client_id={'nRVIaz6AEO2qZ6DCKXDKcw3EX4zRxbjKz64UQDFheRh5VBdAIE'}&client_secret={'obAhKvjIzSik0WT6T7yrMTkKYQcsSUj8nktFxGJF'}" https://api.petfinder.com/v2/oauth2/token

// // Given an empty app object, initializes it filling its attributes,
// // creates a Vue instance, and then initializes the Vue instance.
// let init = (app) => {

// 	// This is the Vue data.
// 	app.data = {
// 		match_cards: [],
// 		disp_cards_idx: 1,
// 		cur_email: "",
// 		test_get_api: "",
// 	};

// 	app.enumerate = (a) => {
// 		// This adds an _idx field to each element of the array.
// 		let k = 1;
// 		a.map((e) => { e._idx = k++; });
// 		return a;
// 	};

// 	app.complete = (pup_cards) => {
// 		pup_cards.map((pup) => {
// 			pup.id = "",
// 			pup.name = "",
// 			pup.image = []
// 		});
// 	};



// 	app.getNextPupsFromAPI = async function getNextPupsFromAPI(id) {
// 		var client = new petfinder.Client({
// 			apiKey: "nRVIaz6AEO2qZ6DCKXDKcw3EX4zRxbjKz64UQDFheRh5VBdAIE",
// 			secret: "obAhKvjIzSik0WT6T7yrMTkKYQcsSUj8nktFxGJF"
// 		});

// 		client.animal.show(id)
// 			.then(resp => {
// 				// Do something with resp.data.animal
// 			});


// 		axios.post(set_curr_dogs_url, { new_pup_cards: app.vue.pup_cards });
// 		app.init();
// 	}

// 	// We form the dictionary of all methods, so we can assign them
// 	// to the Vue app in a single blow.
// 	app.methods = {
// 		complete: app.complete,
// 		enumerate: app.enumerate,
// 		// get_next_pupcards: app.get_next_pupcards,
// 		getNextPupsFromAPI: app.getNextPupsFromAPI,
// 	};

// 	// This creates the Vue instance.
// 	app.vue = new Vue({
// 		el: "#vue-target-matches",
// 		data: app.data,
// 		methods: app.methods,
// 	});


// 	// And this initializes it.
// 	// This is where im going to pull current_pup_cards from the data base
// 	// and then set all their values up, and then set up each cards data
// 	// make sure to call get_next_pupcards if needed
// 	app.init = () => {
// 		console.log("init");
// 		axios.get(get_user_idx_url)
// 			.then(function (response) {
// 				console.log("idx init");
// 				app.vue.disp_cards_idx = response.data.user_index;
// 			});

// 		for (let match of app.vue.match_cards) {
// 			console.log("pup init");
// 			axios.get(get_curr_matches_url, { params: { match_id: match.id } })
// 				.then(function (response) {
// 					match.id = response.data.dog_id;
// 					match.name = response.data.dog_name;
// 					match.image = response.data.dog_photos;
// 				});
// 		}
// 		app.enumerate(app.vue.pup_cards);
// 	};


// 	// Call to the initializer.
// 	app.init();
// };

// // This takes the (empty) app object, and initializes it,
// // putting all the code i
// init(app);
