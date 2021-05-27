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
		match_cards: [],
		disp_cards_idx: 1,
		cur_email: "",
		test_get_api: "",
		email: "",
		phone: "",
		address: "",
		url: "",
		breed: "",
		age: "",
		gender: "",
		size: "",
		fur: "",
		potty: "",
		kid: "",
		image: "",
		loading: false,
	};

	
	app.enumerate = (pup_cards) => {
		let k = 0;
		pup_cards.map((pup) => {
			pup._idx = k++;
		});
	};

	app.getMatchContactFromAPI = async function getMatchContactFromAPI(id) {
		var client = new petfinder.Client({
			apiKey: "nRVIaz6AEO2qZ6DCKXDKcw3EX4zRxbjKz64UQDFheRh5VBdAIE",
			secret: "obAhKvjIzSik0WT6T7yrMTkKYQcsSUj8nktFxGJF"
		});
		app.vue.loading = false;
		client.animal.show(id)
			.then(resp => {
				// Do something with resp.data.animal
				app.vue.email = resp.data.animal.contact.email;
				app.vue.phone = resp.data.animal.contact.phone;
				app.vue.adress = 	resp.data.animal.contact.address.address1+ " " + 
									resp.data.animal.contact.address.address2+ " "+
									resp.data.animal.contact.address.city+ " "+ 
									resp.data.animal.contact.address.state+ " "+
									resp.data.animal.contact.address.postcode+" " +
									resp.data.animal.contact.address.country;
				app.vue.loading = true;
			});
		var contact_modal = document.getElementById("contact_modal");
		contact_modal.classList.toggle('is-active');
	}

	app.getMatchInfoFromAPI = async function getMatchInfoFromAPI(id) {
		var client = new petfinder.Client({
			apiKey: "nRVIaz6AEO2qZ6DCKXDKcw3EX4zRxbjKz64UQDFheRh5VBdAIE",
			secret: "obAhKvjIzSik0WT6T7yrMTkKYQcsSUj8nktFxGJF"
		});
		app.vue.loading = false;
		client.animal.show(id)
			.then(resp => {
				// Do something with resp.data.animal
                app.vue.url= resp.data.animal.url;
                app.vue.breed= resp.data.animal.breeds.primary;
                app.vue.age= resp.data.animal.age;
				app.vue.gender= resp.data.animal.gender;
				app.vue.size= resp.data.animal.size;
				app.vue.fur= resp.data.animal.colors.primary;
				app.vue.potty= resp.data.animal.attributes.house_trained;
				app.vue.kid= resp.data.animal.environment.children;
				app.vue.loading = true;
			});
		var info_modal = document.getElementById("info_modal");
		info_modal.classList.toggle('is-active');
	}

	// We form the dictionary of all methods, so we can assign them
	// to the Vue app in a single blow.
	app.methods = {
		enumerate: app.enumerate,
		getMatchContactFromAPI: app.getMatchContactFromAPI,
		getMatchInfoFromAPI: app.getMatchInfoFromAPI,
	};

	// This creates the Vue instance.
	app.vue = new Vue({
		el: "#vue-matches",
		data: app.data,
		methods: app.methods,
	});


	// And this initializes it.
	// This is where im going to pull current_pup_cards from the data base
	// and then set all their values up, and then set up each cards data
	// make sure to call get_next_pupcards if needed
	app.init = () => {
		console.log("init");
		let match_ids = []
		axios.get(get_matches_id_url)
			.then(function (response) {
				match_ids = response.data.match_ids;
				console.log(match_ids.length)
				for (var i = 0; i < match_ids.length; i++) {
					console.log("pup init\n");
					axios.get(get_curr_matches_url, { params: { match_id: match_ids[i] } })
						.then(function (response) {
							console.log(response)
							let image = response.data.dog_images
							if(image == "[]"){
								image = "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
							}else{
								image = image.split(", ");
								image = image[3].split("'")[3];
							}
							app.vue.match_cards.push({
								user_owned: response.data.user_owned,
								dog_index: response.data.dog_index,
								dog_name: response.data.dog_name,
								dog_images: image,
							})
						});
				}
			});
		
	app.enumerate(app.vue.match_cards);
	};


	// Call to the initializer.
	app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
