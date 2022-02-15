export const titleCase = (data) => {
    return data.toLowerCase().split(' ').map(word => {
        return word.replace(word[0], word[0].toUpperCase())
    }).join(' ')
}