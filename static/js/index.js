// import { Client } from "@petfinder/petfinder-js";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {
    
    // This is the Vue data.
    app.data = {
        pup_cards: [],
        disp_cards_idx: 1,
        cur_email: "",
        test_get_api: "",
        test_add_match: "",

        api_loading: false,
        no_results: false,
        trash_counter: 0,
        change_pref: false,
        no_zip: false,

        breed_pref: "",
        pref_size: "",
        pref_potty: "",
        pref_kid: "",
        pref_location: "",
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        // let k = 1;
        for(let k=1; k<21; k++){
            a.push({
                _idx: k,
                id: "",
                name: "",
                image: [],
                breed: "",
                age: "",
                gender: "",
                size: "",
                fur: "",
                potty: false,
                kid: false,
                location: "",
                url: ""
            });
        }
        return a;
    };

    app.match = function (){

        //Shingo 5/25 Adding matches into matching database
        //====================================================
        app.vue.disp_cards_idx--;
        let match = app.vue.pup_cards[app.vue.disp_cards_idx];
        axios.post(add_match_url, { match: match})
        app.vue.disp_cards_idx++;
        //====================================================

        app.vue.disp_cards_idx++;

        // TODO: or if the dog at the idx is empty
        if (app.vue.disp_cards_idx > 20){
            app.vue.disp_cards_idx = 1;

            app.data.pup_cards = [];
            app.enumerate(app.vue.pup_cards);
            app.getNextPupsFromAPI();
        }

        axios.post(update_idx_url, {disp_cards_idx: app.vue.disp_cards_idx});
        app.init();
    };

    app.no_match = function (){
        app.vue.disp_cards_idx++;

        // TODO: or if the dog at the idx is empty
        if (app.vue.disp_cards_idx > 20){
            app.vue.disp_cards_idx = 1;

            app.data.pup_cards = [];
            app.enumerate(app.vue.pup_cards);
            app.getNextPupsFromAPI();
        }

        axios.post(update_idx_url, {disp_cards_idx: app.vue.disp_cards_idx});
        app.init();
    };

    app.get_test = function (){
        // console.log("get_test\n")
        app.getNextPupsFromAPI();
        app.init();
    };
    
    app.getNextPupsFromAPI = async function getNextPupsFromAPI() {
        app.data.api_loading = true;

        // console.log("get new bitches \n");

        var client = new petfinder.Client({
            apiKey: "nRVIaz6AEO2qZ6DCKXDKcw3EX4zRxbjKz64UQDFheRh5VBdAIE", 
            secret: "obAhKvjIzSik0WT6T7yrMTkKYQcsSUj8nktFxGJF"
        });

        let page = Math.floor(Math.random() * 10)+1; // returns a random integer from 1 to 10
        // console.log(page);

        if(app.vue.pref_location == ""){

            app.vue.no_zip = true;

            // console.log("no location")
            apiResult = await client.animal.search({
                type: "Dog",
                breed: app.vue.pref_breed,
                house_trained: app.vue.pref_potty,
                // location: app.vue.pref_location,
                // distance: 500,
                page,
                limit: 20,
            }).catch(function (error) {
                // console.log(error);
            });
        }
        else{
            // console.log("yes location")
            apiResult = await client.animal.search({
                type: "Dog",
                breed: app.vue.pref_breed,
                house_trained: app.vue.pref_potty,
                location: app.vue.pref_location,
                // distance: 500,
                page,
                limit: 20,
            }).catch(function (error) {
                // console.log(error);
            });
        }

        app.data.pup_cards = [];
        apiResult.data.animals.forEach(function(animal) {
            // ++dogIdx;
            // console.log(dogIdx);
            app.vue.pup_cards.push({
                id: animal.id,
                name: animal.name,
                url: animal.url,
                breed: animal.breeds.primary,
                age: animal.age,
                gender: animal.gender,
                size: animal.size,
                fur: animal.colors.primary,
                potty: animal.attributes.house_trained,
                kid: animal.environment.children,
                image: animal.photos,
                location: animal.contact.address.city+ ", "+ animal.contact.address.state+ " "+ animal.contact.address.postcode
            });
        });

        axios.post(set_curr_dogs_url, {new_pup_cards: app.vue.pup_cards});
        app.init();
        app.data.api_loading = false;
    }

    app.ZIPONLY_getNextPupsFromAPI = async function ZIPONLY_getNextPupsFromAPI() {
        app.data.api_loading = true;

        // console.log("zip only get new bitches \n");

        var client = new petfinder.Client({
            apiKey: "nRVIaz6AEO2qZ6DCKXDKcw3EX4zRxbjKz64UQDFheRh5VBdAIE", 
            secret: "obAhKvjIzSik0WT6T7yrMTkKYQcsSUj8nktFxGJF"
        });

        let page = Math.floor(Math.random() * 10)+1; // returns a random integer from 1 to 10
        console.log(page);
        apiResult = await client.animal.search({
            type: "Dog",
            location: app.vue.pref_location,
            page,
            limit: 20,
        }).catch(function (error) {
            console.log(error);
        });


        app.data.pup_cards = [];
        apiResult.data.animals.forEach(function(animal) {
            // ++dogIdx;
            // console.log(dogIdx);
            app.vue.pup_cards.push({
                id: animal.id,
                name: animal.name,
                url: animal.url,
                breed: animal.breeds.primary,
                age: animal.age,
                gender: animal.gender,
                size: animal.size,
                fur: animal.colors.primary,
                potty: animal.attributes.house_trained,
                kid: animal.environment.children,
                image: animal.photos,
                location: animal.contact.address.city+ ", "+ animal.contact.address.state+ " "+ animal.contact.address.postcode
            });
        });

        axios.post(set_curr_dogs_url, {new_pup_cards: app.vue.pup_cards});
        app.init();
        app.data.api_loading = false;
    }

    // We form the dictionary of all methods, so we can assign them
    // to the Vue app in a single blow.
    app.methods = {
        // complete: app.complete,
        enumerate: app.enumerate,
        match: app.match,
        no_match: app.no_match,
        // get_next_pupcards: app.get_next_pupcards,
        get_test: app.get_test,
        getNextPupsFromAPI: app.getNextPupsFromAPI,
        ZIPONLY_getNextPupsFromAPI: app.ZIPONLY_getNextPupsFromAPI,
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods,
    });


    // And this initializes it.
    // This is where im going to pull current_pup_cards from the data base
    // and then set all their values up, and then set up each cards data
    // make sure to call get_next_pupcards if needed
    app.init = () => {
        axios.get(get_user_idx_url)
            .then(function (response) {
                app.vue.disp_cards_idx = response.data.user_index;
            });
 
        axios.get(get_pref_url)
			.then(function (response) {
				app.vue.pref_breed = response.data.breed;
                // app.vue.pref_potty = response.data.potty;

                response.data.potty == "Yes" ? app.vue.pref_potty = true : app.vue.pref_potty = false;
                app.vue.pref_size = response.data.size;
                app.vue.pref_kid = response.data.kid;
                app.vue.pref_location = response.data.location;
		});

        if(app.vue.pref_location != ""){
            app.vue.no_zip = false;
        }
        // else{
        //     app.vue.no_zip = false;
        // }

        app.data.pup_cards = [];
        app.enumerate(app.vue.pup_cards);
        for (let pup of app.vue.pup_cards) {
            axios.get(get_curr_dogs_url, { params: {pup_idx: pup._idx} })
                .then(function (response) {
                    // results are not there
                    if(response.data.empty == true){
                        app.vue.no_results = true;
                        if(pup._idx >= 20){
                            // console.log("empty, call the pref+zip API ");
                            app.vue.trash_counter++;
                            console.log("trash: " + app.vue.trash_counter);
                            if(app.vue.trash_counter >= 4){
                                app.vue.no_results = false;
                                app.vue.change_pref = true;
                            }
                            else{ app.getNextPupsFromAPI();}

                            if(app.vue.change_pref == true){
                                // console.log("zip only");
                                app.vue.change_pref == false;
                                setTimeout(() => { app.ZIPONLY_getNextPupsFromAPI(); }, 5000);
                                // app.ZIPONLY_getNextPupsFromAPI();
                            }
                        }
                        // else if(app.vue.change_pref == true && app.vue.trash_counter >=4){
                        //     app.ZIPONLY_getNextPupsFromAPI();
                        //     app.vue.change_pref == false;
                        // }
                    }
                    // results are there
                    else{
                        // reset any error catching 
                        app.vue.trash_counter = 0;
                        app.vue.change_pref = false;
                        app.vue.no_results = false;

                        // get db data
                        pup.id = response.data.dog_id;
                        pup.name =response.data.dog_name;
                        pup.breed = response.data.dog_breed;
                        pup.age = response.data.dog_age;
                        pup.gender = response.data.dog_gender;
                        pup.size = response.data.dog_size;
                        pup.fur = response.data.dog_fur;
                        pup.potty = response.data.dog_potty;
                        pup.kid = response.data.dog_kid;
                        pup.location = response.data.dog_location;
                        pup.url = response.data.dog_url;
                        pup.image = response.data.dog_photos;
                        if(pup.image == "[]"){
                            pup.image = "https://i.ibb.co/6vhvddR/pawfect-match-logo-2.png"
                        }
                        else{
                            pup.image = pup.image.split(", ");
                            pup.image = pup.image[3].split("'")[3];
                        }
                    }
                    
                    
                });
        }

        // app.enumerate(app.vue.pup_cards);
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);


