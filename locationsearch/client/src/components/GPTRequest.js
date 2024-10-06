import OpenAI from "openai";
const openai = new OpenAI();

export async function getSynonyms(initWord) {
    let completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {"role": "user", "content": "Query: Provide examples of synonyms for a given location.\nExample 1: Some synonyms for \"restaurant\" are: cafeteria, diner, eatery\nExample 2: Some synonyms for \"" + initWord + "\" are:"}
        ]
    });
    completion = cleanResponse(completion);

    if (completion) {
        return completion;
    } else {
        throw new Error("Invalid place for finding synonyms!");
    }
}

function cleanResponse(res) {
    if (res.indexOf(":") == -1) {
        return null;
    }
    items = res.substr(res.indexOf(":") + 1).split(", "); // cuts after initial colon
    let cleanItems = [];
    items.forEach(element => {
        cleanItems.push(element
            .trim() // removes initial whitespace
            .replace(/\((.*)\)/gm, "") // removes parentheticals
            .replace(/(?:^|\W)and(?:$|\W)/gm, "") // removes the word and
            .replace(".", "") // removes periods
            .trim()); // removes any lingering whitespace
    });

    return cleanItems;
}