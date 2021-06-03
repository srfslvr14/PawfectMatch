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
		cur_email: "",
		email: "",
		phone: "",
		breed: "",
		age: "",
		size: "",
		fur: "",
		gender: "",
		potty: "",
		kid: "",
		// location: "",
	};

	app.enumerate = (a) => {
		let k = 0;
		a.map((e) => {e._idx = k++;});
		return a;
	};

    app.set_pref = function () {
        axios.post(set_pref_url,
            {
                breed: app.vue.breed,
				age: app.vue.age,
				size: app.vue.size,
				fur: app.vue.fur,
				gender: app.vue.gender,
				potty: app.vue.potty,
				kid: app.vue.kid,
				// location: app.vue.location,
            }).then(function (response) {
            app.vue.rows.push({
                id: response.data.id,
                breed: app.vue.breed,
				age: app.vue.age,
				size: app.vue.size,
				fur: app.vue.fur,
				gender: app.vue.gender,
				potty: app.vue.potty,
				kid: app.vue.kid,
            });
            // app.reset_form();
            app.set_add_status(false);
            app.set_is_hidden(true);
            app.init();
        });
    };

	app.set_add_status = function (new_status) {
        app.vue.set_mode = new_status;
    };

	app.set_is_hidden = function (new_status) {
        app.vue.is_hidden = new_status;
    };

	// app.reset_form = function () {
    //     app.vue.set_mode = false;
	// 	app.vue.is_hidden = true;
	// 	app.vue.breed = "";
	// 	app.vue.age = "";
	// 	app.vue.size = "";
	// 	app.vue.fur = "";
	// 	app.vue.gender = "";
	// 	app.vue.potty = "";
	// 	app.vue.kid = "";
	// 	app.vue.location = "";
    // };  

	// We form the dictionary of all methods, so we can assign them
	// to the Vue app in a single blow.
	app.methods = {
		enumerate: app.enumerate,
		set_pref: app.set_pref,
		set_add_status: app.set_add_status,
		set_is_hidden: app.set_is_hidden,
		// reset_form: app.reset_form,
	};

	// This creates the Vue instance.
	app.vue = new Vue({
		el: "#vue-profile",
		data: app.data,
		methods: app.methods,
	});


	// And this initializes it.
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
