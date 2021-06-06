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
		set_mode: false,
		is_hidden: true,
		invalidZIP: false,
		display_warning: false,

		breed: "",
		age: "",
		size: "",
		fur: "",
		gender: "",
		potty: "",
		kid: "",
		location: "",
	};

    app.set_pref = function () {
		if(app.vue.invalidZIP){ // not a valid ZIP
			app.vue.display_warning = true;
		}
		else{
			app.vue.display_warning = false;
			axios.post(set_pref_url,
				{
					breed: app.vue.breed,
					age: app.vue.age,
					size: app.vue.size,
					fur: app.vue.fur,
					gender: app.vue.gender,
					potty: app.vue.potty,
					kid: app.vue.kid,
					location: app.vue.location,
				});
	
				// app.reset_form();
				app.set_add_status(false);
				app.set_is_hidden(true);
				app.init();
		}
		// app.init();
    };

	app.reset_form = function () {
		app.vue.breed = "";
		app.vue.age = "";
		app.vue.size = "";
		app.vue.fur = "";
		app.vue.gender = "";
		app.vue.potty = "";
		app.vue.kid = "";
		app.vue.location = "";

		axios.post(set_pref_url,
        	{
                breed: app.vue.breed,
				age: app.vue.age,
				size: app.vue.size,
				fur: app.vue.fur,
				gender: app.vue.gender,
				potty: app.vue.potty,
				kid: app.vue.kid,
				location: app.vue.location,
            });
    };  

	app.cancel_changes = function (){
		app.init();
	};

	app.set_add_status = function (new_status) {
        app.vue.set_mode = new_status;
    };

	app.set_is_hidden = function (new_status) {
        app.vue.is_hidden = new_status;
    };

	app.zip_validator = function (){
		var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(app.vue.location);
		console.log(isValidZip)
		if(isValidZip){
			app.vue.invalidZIP = false;
		}
		else{
			app.vue.invalidZIP = true;
		}
	}

	// We form the dictionary of all methods, so we can assign them
	// to the Vue app in a single blow.
	app.methods = {
		set_pref: app.set_pref,
		set_add_status: app.set_add_status,
		set_is_hidden: app.set_is_hidden,
		reset_form: app.reset_form,
		cancel_changes: app.cancel_changes,
		zip_validator : app.zip_validator
	};

	// This creates the Vue instance.
	app.vue = new Vue({
		el: "#vue-profile",
		data: app.data,
		methods: app.methods,
	});


	// And this initializes it.
	app.init = () => {
		// console.log("pup init" + pup._idx);
		axios.get(get_pref_url)
			.then(function (response) {
				// app.vue.breed = response.data.breed;
				response.data.breed 	? app.vue.breed 	= response.data.breed 	: app.vue.breed = "";
				response.data.age 		? app.vue.age 		= response.data.age 	: app.vue.age = "";
				response.data.size 		? app.vue.size 		= response.data.size 	: app.vue.size = "";
				response.data.fur 		? app.vue.fur 		= response.data.fur 	: app.vue.fur = "";
				response.data.gender 	? app.vue.gender 	= response.data.gender 	: app.vue.gender = "";
				response.data.potty 	? app.vue.potty 	= response.data.potty 	: app.vue.potty = "";
				response.data.kid 		? app.vue.kid 		= response.data.kid 	: app.vue.kid = "";
				response.data.location 	? app.vue.location 	= response.data.location: app.vue.location = "";
		});
	};


	// Call to the initializer.
	app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
