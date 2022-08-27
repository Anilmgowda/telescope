export const removeUnderScoreAndCapitalize = (str) => {
    let wordArray = str.split("_");
    let newArray = wordArray?.map(word => {
        return word[0].toUpperCase() + word.substring(1)?.toLowerCase()
    }).join(" ")
    return newArray
}