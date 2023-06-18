export interface ImageItem {
    // The ID of the image
    // When doing random pick
    // i will generate a random number
    id: number,
    // Link to this image
    src: string,
    // The prompt used to generate this image
    prompt: string,
    // The following props is related to the girl
    // Age
    age: string,
    // Name
    name: string,
    // Educational background
    education: string,
    // Hometown
    hometown: string,
    // Language of speaking
    language: string,
    // Personality
    personality: string,
    // Figure
    figure: string,
    // Hobby
    hobby: string,
    // Other informations like Sense of Humor, Morality etc
    other: string,

    // // Link to an compressed & optimized version of this image
    // srcSmall: string,
    // // URL for the image's gallery
    // gallery: string,
    // // Image dimensions
    // width: number,
    // height: number,
    // // Seed
    // seed: string,
    // // Whether this image is a grid of multiple images
    // grid: boolean,
    // // The model used to generate this image
    // model: string,
    // // Guidance scale
    // guidance: number,
    // // The ID for this image's prompt
    // promptid: string
    // // Whether this image is classified as NSFW
    // nsfw: boolean,
};
