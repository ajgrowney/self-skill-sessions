
let getContent = (change, type) => {
    if(type === "Ideas"){
        // Object destructuring to extract the change's title, description, user, likes, and id
        let { title, user, likes, description } = change.doc.data()
        let { id } = change.doc

        // Create the post object and update the state with the new post
        let post = { id, title, user, likes, description }
        return post;
    }else if(type === "Events"){
        let { title, description, datetime_scheduled, host, location, post_id, attendees } = change.doc.data()
        let { id } = change.doc
        let event = { id, title, description, datetime_scheduled, host, location, post_id, attendees };
        return event;

    }
}

export { getContent }