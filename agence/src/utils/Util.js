export const fetchImageFromUrl = (url_img) => {

    let path = url_img?.split("/medias")
    if(path !== undefined) {
        return "../../../backend/medias" + path[1]
    }
    return " "
}