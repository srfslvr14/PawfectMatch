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
        console.log("matching\n")

        //Shingo 5/25 Adding matches into matching database
        //====================================================
        app.vue.disp_cards_idx--;
        let match = app.vue.pup_cards[app.vue.disp_cards_idx];
        axios.post(add_match_url, { match: match})
        app.vue.disp_cards_idx++;
        //====================================================

        app.vue.disp_cards_idx++;

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
        console.log("hating\n")
        app.vue.disp_cards_idx++;

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
        console.log("get_test\n")
        app.getNextPupsFromAPI();
    };

    app.get_init = function (){
        console.log("init\n")
        app.init();
    };

    app.getNextPupsFromAPI = async function getNextPupsFromAPI() {
        console.log("get new bitches \n");
        var client = new petfinder.Client({
            apiKey: "nRVIaz6AEO2qZ6DCKXDKcw3EX4zRxbjKz64UQDFheRh5VBdAIE", 
            secret: "obAhKvjIzSik0WT6T7yrMTkKYQcsSUj8nktFxGJF"
        });

        let page = 1;
        apiResult = await client.animal.search({
            type: "Dog",
            breed: "Poodle",
            page,
            limit: 20,
        });

        app.data.pup_cards = [];

        let dogIdx = (page - 1) * 100;
        apiResult.data.animals.forEach(function(animal) {
            ++dogIdx;
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
                location: "",
            });
        });

        axios.post(set_curr_dogs_url, {new_pup_cards: app.vue.pup_cards});
        app.init();
    }

    // We form the dictionary of all methods, so we can assign them
    // to the Vue app in a single blow.
    app.methods = {
        // complete: app.complete,
        enumerate: app.enumerate,
        match: app.match,
        no_match: app.no_match,
        // get_next_pupcards: app.get_next_pupcards,
        get_init: app.get_init,
        get_test: app.get_test,
        getNextPupsFromAPI: app.getNextPupsFromAPI,
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
        console.log("init");
        axios.get(get_user_idx_url)
            .then(function (response) {
                console.log("idx init");
                app.vue.disp_cards_idx = response.data.user_index;
            });

        app.data.pup_cards = [];
        app.enumerate(app.vue.pup_cards);
        // TODO make a reset pup_cards function, to set pupcards=[], and then insert 20 of them? 
        // to call before here before for loop, and before api calls to reset the 20
        for (let pup of app.vue.pup_cards) {
            // console.log("pup init" + pup._idx);
            axios.get(get_curr_dogs_url, { params: {pup_idx: pup._idx} })
                .then(function (response) {
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
