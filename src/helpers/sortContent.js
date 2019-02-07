let sortContent = (content, type) => {
    if(type === "Ideas"){
        let sortedContent = content.sort((a,b) => ((a.likes.length < b.likes.length) ? 1 : -1));
        return sortedContent;
    }else{
        let sortedContent = content.sort((a,b) => ((a.datetime_scheduled < b.datetime_scheduled) ? 1 : -1))
        return sortedContent;
    }
}
export {sortContent} 