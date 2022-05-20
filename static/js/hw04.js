//html for story
const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {

            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

// HTML for User Profile
const userProfile2Html = userprofile =>{
    return `
            <img class="pic" src="${userprofile.image_url}" alt="Profile photo for ${userprofile.image_url} "/>
            <h1 id="username">${userprofile.username}</h1>
        `
};

const getUserProfile = () => {
    fetch('/api/profile')
    .then(response=> response.json())

    .then(userprofile => {

        console.log(userprofile)
        const html = userProfile2Html(userprofile)
        document.querySelector('header').innerHTML = html;
    })
};

const getPost = () =>{
    fetch('/api/posts/?limit=10')
    .then(response=> response.json())
    .then(post => {
        console.log(post)
        const html = post.map(post2HTML).join("\n")
        document.querySelector('#posts').innerHTML = html;
    })
};

const allComments = (comments, post) => {
    return `
        <div class="comment">
            <img class="pic" src="${comments.user.thumb_url}"  alt="Profile photo for ${comments.user.thumb_url}"/>
            <div class="comment-text">
                <span><strong>${comments.user.username}</strong></span>
                <span> ${comments.text}</span>
                <p class="timestamp">${post.display_time}</p> 
            </div>
            <button><a class="far fa-heart"></a></button> 
        </div>`
}

const removeModal = (ev, PostId) => {

    document.querySelector('#modal-container').innerHTML = "";
    document.querySelector('body').style.overflow = 'scroll'
    document.getElementById(`viewAllButton+${PostId}`).focus()
};

const modal = ev => {
    const postId = ev.currentTarget.dataset.postId;
    fetch(`/api/posts/${postId}`)

        .then(response => response.json())
        .then(post =>{
            let commenthtml = ``
            for(var i=0; i<post.comments.length; i++){
                commenthtml += allComments(post.comments[i], post)         }
            const html = `
                <div class="background">
                    <div class="remove">
                        <button id="remove"  onclick="removeModal(event, ${postId})"><a class="fas fa-times"></a></button>
                    </div>
                    <div class="modal" role="dialog">
                        <img src="${post.image_url}"/>
                        <div class="side">
                            <div class="top">
                                <header>
                                    <img class="pic" src="${post.user.thumb_url}" alt="Profile photo for ${post.user.thumb_url} "/>
                                    <h1 id="username">${post.user.username}</h1>
                                </header>
                            </div>
                            <div class="all-comments">
                            </div>
                        </div>  
                    </div>
                </div>`;
            document.querySelector('#modal-container').innerHTML = html;

            document.querySelector('.all-comments').innerHTML = commenthtml;
            document.querySelector('body').style.overflow = 'hidden'

            document.getElementById('remove').focus()
        })
};


const post2HTML = post =>{
    return `
    <div class = "card" data-post-id= "${post.id}">
        <div class = "header">
            <h2>${post.user.username}</h2>
            <a class="fas fa-ellipsis-h"></a>
        </div>
        <img src="${post.image_url}" alt="${post.alt_text}">
        <div class="main">
            <div class="buttons">
                <section class="imain">
                    <button ${likeButton(post)}</button>
                    <a class="far fa-comment"></a>
                    <a class="far fa-paper-plane"></a>
                </section>
                <section id="bookmark">
                    <button onclick="tobookmark(event)" 
                            data-post-id= "${post.id}" 
                            ${post.current_user_bookmark_id ? `data-bookmark-id = "${post.current_user_bookmark_id}"`: ''}>
                        ${post.current_user_bookmark_id ? '<a class="fas fa-bookmark"></a>' : '<a class="far fa-bookmark"></a>'}
                    </button>
                </section>   
            </div>
            <span class="likes"><strong> ${post.likes.length} likes</strong></span>
            <div class="caption">
                <span><strong>${post.user.username}</strong></span>
                <span>${post.caption}</span>
                <span><a href="" target="_blank">more</a></span>
            </div>
            ${post.comments.length > 1 ? `<p class="view"><button class="link" id="viewAllButton+${post.id}" data-post-id= "${post.id}"onclick="modal(event)">View all ${post.comments.length} comments</button></p>`: '' }
            <div class="comments">
                <section>
                    <span><strong>${post.comments.length != 0 ? `${post.comments[0].user.username}`: ''}</strong></span>
                    <span> ${post.comments.length != 0 ? `${post.comments[0].text}`: ''}</span>
                </section>
                <p class="timestamp">${post.display_time}</p>
            </div>  
        </div>
        <div class="addcomment">
            <section>
                <a class="far fa-smile"></a>
            </section>
            <input type="text" aria-label="Add a comment"  placeholder="Add a comment ..." id="comment-text-${post.id}">
            <button id="post" class="link" onclick="addComment(event, ${post.id})" data-post-id= "${post.id}">Post</button>
        </div>
    </div>`
};

const comment2HTML = (post, commentInfo) => {
    return `
    <div class = "header">
        <h2>${post.user.username}</h2>
        <a class="fas fa-ellipsis-h"></a>
    </div>
    <img src="${post.image_url}" alt="${post.alt_text}">
    <div class="main">
        <div class="buttons">
            <section class="imain">
                <button onclick="likeUnlike(event)" data-post-id= "${post.id}" ${post.current_user_like_id ? `data-like-id = "${post.current_user_like_id}"`: ''}>
                    <a class="fa${post.current_user_like_id ? 's': 'r'} fa-heart"></a>
                </button>
                <a class="far fa-comment"></a>
                <a class="far fa-paper-plane"></a>
            </section>
            <section id="bookmark">
                <button onclick="tobookmark(event)" 
                        data-post-id= "${post.id}" 
                        ${post.current_user_bookmark_id ? `data-bookmark-id = "${post.current_user_bookmark_id}"`: ''}>
                        ${post.current_user_bookmark_id ? '<a class="fas fa-bookmark"></a>' : 
                        '<a class="far fa-bookmark"></a>'}
                </button>
            </section>   
        </div>
        <span class="likes"><strong> ${post.likes.length} likes</strong></span>
        <div class="caption">
            <span><strong>${post.user.username}</strong></span>
            <span>${post.caption}</span>
            <span id="more"><a href="" target="_blank">more</a></span>
        </div>
        <p class="timestamp">${post.display_time}</p>
        ${post.comments.length > 1 ? `<p class="view"><button  class="link" id="viewAllButton" data-post-id= "${post.id}"onclick="modal(event)">View all ${post.comments.length} comments</button></p>`: '' }
        <div class="comments">
            <section>
                <span><strong>${post.comments.length != 0 ? `${commentInfo.user.username}`: ''}</strong></span>
                <span> ${post.comments.length != 0 ? `${commentInfo.text}`: ''}</span>
            </section>
        </div>  
    </div>
    <div class="addcomment">
        <section>
            <a class="far fa-smile"></a>
        </section>
        <input type="text" aria-label="Add a comment"  placeholder="Add a comment ..." id="comment-text-${post.id}">
        <button id="post" class="link" onclick="addComment(event, ${post.id})" data-post-id= "${post.id}">Post</button>
    </div>`

}

const addComment = (ev, postId) => {
    console.log(ev)
    const idValue = `comment-text-${postId}`
    const elem = ev.currentTarget
    const text = document.getElementById(idValue).value

    if (text == ""){

        console.log('no text')
    }
    else{
        console.log(text)
        Text(elem, postId, text)
    }
    
}

const Text = (elem, postId, text) => {
    const postData = {
        "post_id": postId,
        "text": text
    };
    
    fetch("http://localhost:5000/api/comments", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(commentInfo => {

            console.log(commentInfo);
            const posturl = `/api/posts/${postId}`

            fetch(posturl)
            .then(response => response.json())
            .then(post => {

                console.log(post);
                const html = comment2HTML(post, commentInfo)
                document.querySelector(
                    "[data-post-id="+ CSS.escape(postId)+"]").innerHTML = html
            });
        });
        
    
}

// fetch data of suggestions from API endpoint:
const getSuggestions = () =>{
    fetch('api/suggestions/')
    .then(response=> response.json())
    .then(users => {

        console.log(users)
        const html = users.map(userHTML).join('\n')
        document.querySelector(
            '#suggestions').innerHTML = html;
    })
};
// HTML for suggestion panel
const userHTML = user =>{
    return `<section class="suggestion">
                <img class = "pic" src="${user.thumb_url}"/>
                <div>
                    <p class="username">${user.username}</p>
                    <p class="suggestion-text">Suggested for you</p>
                </div>
                <div>
                    <button 
                        data-user-id="${user.id}"
            
                        onclick="to_follow(event);
                        " class= "link">follow</button>
                </div>
            </section>`
};

// making the bookmark button work
const tobookmark = ev =>{
    console.log(ev)
    const elem = ev.currentTarget
    console.log(elem)
    const postId = elem.getAttribute("data-post-id")

    if (ev.currentTarget.getAttribute("data-bookmark-id") !==null) {

        const bookmarkId = elem.getAttribute("data-bookmark-id")
        console.log('unbookmark')
        unbookmark(postId, bookmarkId, elem)
    }
    else{
        console.log('bookmark')
        bookmark(postId, elem)
    }
}
const bookmark = (postId, elem) => {
    const postData = {
        "post_id": postId
    };
    
    fetch("http://localhost:5000/api/bookmarks/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.setAttribute('data-bookmark-id', data.id);
            elem.setAttribute('aria-checked', 'true');
            elem.setAttribute('aria-label', 'bookmarked');
            redrawPost(postId);
        });
}
const  unbookmark = (postId, bookmarkId, elem) => {
    const deletebookmarkUrl = `http://localhost:5000/api/bookmarks/${bookmarkId}`
    fetch(deletebookmarkUrl, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {

        console.log(data);
        elem.removeAttribute('data-bookmark-id');
        elem.setAttribute('aria-checked', 'false');
        elem.setAttribute('aria-label', 'unbookmarked');
        redrawPost(postId);
    });
}

const redrawPost = PostId => {
    fetch(`/api/posts/${PostId}`)
    .then(response => response.json())
    .then(updatedPost =>{
        console.log(updatedPost);
        const html = post2HTML(updatedPost);
        document.querySelector("[data-post-id=" + CSS.escape(PostId) + "]").innerHTML = html;
        //const newElement = stringToHTML(html);
        //const postElement = document.querySelector(`#post_${PostId}`);
        //postElement.innerHTML = newElement.innerHTML;
        });

};

const stringToHTML = htmlString => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.firstChild;
}

const likeButton = post => {
    if (post.current_user_like_id) {
        return `
            <button 
                data-post-id= "${post.id}"
                data-like-id="${post.current_user_like_id}"
                aria-label="Like/Unlike"
                aria-checked="true"
                onclick="LikeUnlike(event)">
                <i class="fas fa-heart"></i>
            </button>
        `
    }
    else {
        return `
            <button 
                data-post-id= "${post.id}"
                aria-label="Like/Unlike"
                aria-checked="false"
                onclick="LikeUnlike(event)">
                <i class="far fa-heart"></i>
            </button>
        `
    }
}

const LikeUnlike = ev => {
    const elem = ev.currentTarget
    if (elem.getAttribute('aria-checked') === 'true') {
        console.log('unlike')
        unlikePost(elem)
    }
    else {
        console.log('like')
        likePost(elem)
    }
}

const likePost = elem => {
    const postId =  Number(elem.dataset.postId)
    console.log('like post', elem);
    const postData = {
        "post_id": postId
    }
    fetch("/api/posts/likes",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    
    .then(response => response.json())
    .then(data=> {
        console.log(data);
        elem.setAttribute('data-like-id', data.id);
        elem.setAttribute('aria-checked', 'true');
        elem.setAttribute('aria-label', 'liked');
        redrawPost(postId);
        //redraw the post
    });
};

const unlikePost = elem => {
    const postId =  Number(elem.dataset.postId)
    console.log('unlike post', elem);
    fetch(`/api/posts/likes/${elem.dataset.likeId}`,{
        method:"DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data=> {
        console.log(data);
        console.log('redraw the posr')
        elem.removeAttribute('data-like-id');
        elem.setAttribute('aria-checked', 'false');
        elem.setAttribute('aria-label', 'unliked');
        redrawPost(postId);
        //redraw the post
    });
};

const to_follow = ev =>{
    console.log(ev);
    console.log(ev.currentTarget);
    const elem = ev.currentTarget;
    if (elem.innerHTML !== 'follow'){
        unfollowUser(elem.dataset.followingId, elem);
    }
    else{
        followUser(elem.dataset.userId, elem);
    }
}


const followUser = (userId, elem) => {
    const postData = {
        "user_id": userId
    };
    
    fetch("http://localhost:5000/api/following/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            elem.innerHTML = 'unfollow';
            elem.setAttribute('data-following-id', data.id);
            elem.setAttribute('aria-checked', 'true');
            elem.setAttribute('aria-label', 'unfollow');
        });
}
// Unfollow fetch function
const unfollowUser = (followingId, elem) => {
    const deleteURL = `http://localhost:5000/api/following/${followingId}`
    fetch(deleteURL, {
        method: "DELETE",
    })

    .then(response => response.json())
    .then(data => {

        console.log(data);
        elem.innerHTML = 'follow';
        elem.removeAttribute('data-following-id');
        elem.setAttribute('aria-checked', 'false');
        elem.setAttribute('aria-label', 'follow');
    });
}

const initPage = () => {
    getUserProfile();
    displayStories();
    getSuggestions();
    getPost();
};

// invoke init page to display stories:
initPage();