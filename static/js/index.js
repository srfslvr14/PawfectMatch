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
        pup_cards: [],
        disp_cards_idx: 1,
        cur_email: "",
        test_get_api: "",
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 1;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.complete = (pup_cards) => {
        pup_cards.map((pup) => {
            pup.id = "",
            pup.name = "",
            pup.image = [],
            pup.breed = "",
            pup.age = "",
            pup.gender = "",
            pup.size = "",
            pup.fur = "",
            pup.potty = false,
            pup.kid = false,
            pup.location = "",
            pup.url = ""
        });
    };

    app.match = function (){
        console.log("matching\n")
        app.vue.disp_cards_idx++;

        if (app.vue.disp_cards_idx > 19){
            app.vue.disp_cards_idx = 0;
            app.getNextPupsFromAPI();
        }

        axios.post(update_idx_url, {disp_cards_idx: app.vue.disp_cards_idx});
        app.init();

        // post pupcard at disp_cards_idx to recent matches database
        // disp_cards_idx++
            // if disp_cards_idx > 20, disp_cards_idx = 0
            // call get_next_pupcards
    };

    app.no_match = function (){
        console.log("hating\n")
        app.vue.disp_cards_idx++;
        console.log(app.vue.disp_cards_idx + "\n");

        if (app.vue.disp_cards_idx > 19){
            app.vue.disp_cards_idx = 0;
            app.getNextPupsFromAPI();
        }

        axios.post(update_idx_url, {disp_cards_idx: app.vue.disp_cards_idx});
        app.init();


        // disp_cards_idx++
            // if disp_cards_idx > 20, disp_cards_idx = 0
            // call get_next_pupcards
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

        let dogIdx = (page - 1) * 100;
        apiResult.data.animals.forEach(function(animal) {
            ++dogIdx;
            console.log(dogIdx);
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
        complete: app.complete,
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

        for (let pup of app.vue.pup_cards) {
            console.log("pup init");
            axios.get(get_curr_dogs_url, { params: {pup_id: pup.id} })
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
        app.enumerate(app.vue.pup_cards);
    };

    // app.init = () => {
    //     axios.get(load_post_url)
    //         .then(function (response) {
    //             app.vue.cur_email = response.data.email;
    //             let posts = response.data.rows;
    //             app.complete(posts);
    //             app.enumerate(posts);
    //             app.vue.rows = posts;
    //         }).then(() => {
    //             for(let row of app.vue.rows){
                    // axios.get(get_thumbs_url, { params: {post_id: row.id} }) // maybe add usernames here
    //                     .then((result) => {
    //                         row.like = result.data.like;
    //                         row.dislike = result.data.dislike;
                            
    //                         row.hover_like = result.data.like;
    //                         row.hover_dislike = result.data.dislike;

    //                         row.liked_list = result.data.post_likers;
    //                         row.disliked_list = result.data.post_dislikers ;
    //                     });
    //                 }
    //             });
    // };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
