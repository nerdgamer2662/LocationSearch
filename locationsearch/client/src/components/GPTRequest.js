/*
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: "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", dangerouslyAllowBrowser: true });

export async function getSynonyms(initWord) {
    let completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {"role": "user", "content": "Query: Fit a given word to one of the following categories: accounting,airport,amusement_park,aquarium,art_gallery,atm,bakery,bank,bar,beauty_salon,bicycle_store,book_store,bowling_alley,bus_station,cafe,campground,car_dealer,car_rental,car_repair,car_wash,casino,cemetery,church,city_hall,clothing_store,convenience_store,courthouse,dentist,department_store,doctor,drugstore,electrician,electronics_store,embassy,fire_station,florist,funeral_home,furniture_store,gas_station,gym,hair_care,hardware_store,hindu_temple,home_goods_store,hospital,insurance_agency,jewelry_store,laundry,lawyer,library,light_rail_station,liquor_store,local_government_office,locksmith,lodging,meal_delivery,meal_takeaway,mosque,movie_rental,movie_theater,moving_company,museum,night_club,painter,park,parking,pet_store,pharmacy,physiotherapist,plumber,police,post_office,primary_school,real_estate_agency,restaurant,roofing_contractor,rv_park,school,secondary_school,shoe_store,shopping_mall,spa,stadium,storage,store,subway_station,supermarket,synagogue,taxi_stand,tourist_attraction,train_station,transit_station,travel_agency,university,veterinary_care,zoo\n" + 
                                "Example 1: An inn is in the category of: hotel\n" + "Example 2: A(n) " + 
                                initWord.trim() + " is in the category of:"}
        ]
    });

    console.log(completion.choices[0].message);
    completion = completion.choices[0].message.content.trim().toLowerCase();

    if (completion == "none") {
        throw new Error("Failed to fit to category!");
    } else {
        return completion;
    }
}

// function cleanResponse(res) {
//     if (res.indexOf(":") == -1) {
//         return null;
//     }
//     items = res.substr(res.indexOf(":") + 1).split(", "); // cuts after initial colon
//     let cleanItems = [];
//     items.forEach(element => {
//         cleanItems.push(element
//             .trim() // removes initial whitespace
//             .replace(/\((.*)\)/gm, "") // removes parentheticals
//             .replace(/(?:^|\W)and(?:$|\W)/gm, "") // removes the word and
//             .replace(".", "") // removes periods
//             .trim()); // removes any lingering whitespace
//     });

//     return cleanItems;
// }
*/