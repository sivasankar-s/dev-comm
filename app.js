// import {gun ,user, usrname} from "./login.js";

const gun = new Gun();
const user = gun.user();
let usernameElem = document.getElementById("username");

const userrname = JSON.parse(sessionStorage.getItem('user'));

if(!userrname) {
  window.location.href = "login.html";
}

console.log(userrname);
// console.log(user.is);
if(usernameElem){
usernameElem.innerText = userrname;
}

document.addEventListener("DOMContentLoaded", function() {
  

  user.recall({ sessionStorage: true }, async (ack) => {
    if (ack.err) {
      console.error("Error recalling user:", ack.err);
      // redirect to login page
      window.location.href = "login.html";
    } else if (user.is) {
      const username = user.get("alias").once((alias) => {
        const usernameElem = document.getElementById("username");
        usernameElem.innerText = userrname;
      });
    } else {
      // redirect to login page
      window.location.href = "login.html";
    }
  });

  

  const logoutButton = document.getElementById("logout-button");
  if(logoutButton){
  logoutButton.addEventListener("click", async (event) => {
    event.preventDefault();
    user.leave();
    window.location.href = "login.html";
  });
}

  const createPostButton = document.getElementById("createpost-button");
  if(createPostButton) {
  createPostButton.addEventListener("click", async (event) => {
    event.preventDefault();
    // window.open("createPost.html", '_blank');
    window.location.href = "createPost.html";
  });
  }

  ///////////////////// Top Bar ///////

  
  // Get the navbar
var navbar = document.getElementById("header");
if(navbar) {
  // When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};



// Get the offset position of the navbar

var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}
}

///////////////////////////////////

  const posts = gun.get("devposts");
  // console.log(user._.soul);
  // const userPublicKey = user.is.pub;
  // console.log(userPublicKey);
  const form = document.querySelector(".form");
  const editform = document.querySelector(".editform"); ////////////// For the form in edit post

  const postContainer = document.querySelector(".posts");
  if(postContainer){
  postContainer.id = "postss";
  }
  
  var checkDeleted = false;
  var deletebutton;

  posts.map().once( (post, id) => {

   if(post != null) {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.dataset.postId = id; // set the data attribute for the post ID
    const postReff =  gun.get('devposts').get(postElement.dataset.postId);
    postElement.innerHTML =  `
    <div class="ttitle">
    <h2 id="card-title">${post.title}</h2>
    <span class="tooltiptext">${post.title}</span>
    </div>
  
  `;

  // <button id="editButton">Edit</button>
  const editbutton = document.createElement("button");
  deletebutton = document.createElement("button");
  if(post.user === userrname){
  
  editbutton.id = "editButton";
  const text = document.createTextNode("Edit");
  editbutton.appendChild(text);
  postElement.appendChild(editbutton);

  deletebutton.id = "deleteButton";
  const textt = document.createTextNode("x");
  
  deletebutton.appendChild(textt);
  postElement.appendChild(deletebutton);

  postElement.insertAdjacentHTML("beforeend", `<span id="posted-by">Posted by: ${post.user} (Me)</span>`);
  postElement.insertAdjacentHTML("beforeend", `<span id="posted-at">On: ${post.timestamp}</span>`);
  }
  else{
    postElement.insertAdjacentHTML("beforeend", `<span id="posted-by">Posted by: ${post.user}</span>`);
  postElement.insertAdjacentHTML("beforeend", `<span id="posted-at">On: ${post.timestamp}</span>`);
  }

  
  
    if(!post.postid){
    postReff.put({ postid: postElement.dataset.postId = id });
    // setTimeout(function() {
    //   //your code to be executed after 1 second
    //   //event.preventDefault();
    //   location.reload();
    //     }, 2000);
    }
    

   // const editbutton = document.getElementById("editButton");
   if(post.user === userrname){
  if(editbutton) {
    editbutton.addEventListener("click", async (event) => {
      event.preventDefault();
      
      window.open(`/editPost.html?id=${post.postid}`, '_blank');
      // window.location.href = ;
    });
    }
    if(deletebutton) {
      deletebutton.addEventListener("click",  (event) => {
        
        if(confirm("Delete Post?")){
          checkDeleted = true;
        postContainer.disabled = true;
        document.getElementById("postss").disabled = true;
        event.preventDefault();
        gun.get('devposts').get(post.postid).put(null,(ack) => {
          if (ack.err) {
            console.error('Error deleting post', ack.err);
          } else {
            console.log('Post deleted successfully');
          }
        });
         //window.close();
        //window.open(`/index.html`, '_blank');
        //  window.location.href = "/index.html";
        //location.reload();
        setTimeout(function() {
          //your code to be executed after 1 second
          //event.preventDefault();
          location.reload();
            }, 100);

          }
          else{
            // This is to Prevent opening new tab even when clicked cancel
            checkDeleted=true;
            setTimeout(function() {
              
              checkDeleted=false;
                }, 100);
          }
      });
      }

      if(postContainer) {
        postContainer.appendChild(postElement);
      }
      
  }

  // if(postContainer && post.postid){
  //   postContainer.appendChild(postElement);
  //   }

    if(postContainer ){
      postContainer.appendChild(postElement);
      }

}//////////////if post not null


  }); // map posts

  
 

  // Add an event listener to each post element
  if(postContainer){
  postContainer.addEventListener("click", (event) => {
    const postElement = event.target.closest(".post");
    if (postElement && checkDeleted == false) {
      const postId = postElement.dataset.postId;
      const postUrl = `/#/Dev-comm/post/${postId}`;

      var newTab = window.open(postUrl, '_blank');
      //newTab.addEventListener('load', function() {///////////
      // Retrieve the post content from Gun
  const postRef = gun.get('devposts').get(postId);

  

  postRef.once((post) => {
   // if(post != null) {
    const postTitle = post.title;
    const postContent = post.content;
    const postedBy = post.user;
    const postedAt = post.timestamp;


    //////////////////// For the edit update post//////////////////


    // Define the function that adds the event listener to the edit button
  



    // Display the post content in the HTML of the new page
    if(newTab) {
    newTab.document.write(`
    <!DOCTYPE html>
      <html>
      
        <head>
          <title>Dev-comm -${postTitle}</title>
          <link rel="stylesheet" href="newtabstyle.css">
          
        </head>
        <body>
  
        <div id="header"><a href="/"><span id="PageTitle">Developer Community</span></a> </div>
          <div class="container">
        
          <div class="post-content">
          <h2 id="post-title">${postTitle}</h2>
          <p id="post-body">
      
          ${postContent}
          </p>
          <div class="author">
          <h3 id="post-author">${postedBy}</h3>
          <h3 id="post-at">Posted On: ${postedAt}</h3>
          </div>
          </div>

          
          </div>

          

          
          
          <script>
          
          </script>
        </body>
        
      </html>
    `);
    }////////////////new tab



  //}///////// if post not null
  });

//}); /////new tab event listener


  
    }
  });
}



if(form){
  console.log("inside form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newTitle = document.querySelector("#newTitle").value;
    //let newPost = document.querySelector("#newPost").value;
    let str;
    const textarea = document.querySelector("#newPost");
    //textarea.addEventListener('input', function() {
      // Get the value of the textarea
      const textareaValue = document.querySelector("#newPost").value;
      // console.log(textareaValue);
      // Replace newlines with HTML line breaks
      const modifiedTextareaValue = textareaValue.replace(/\n/g, "<br>\r\n");
      
      // Store the modified value in the object property
      str = modifiedTextareaValue;
      // console.log(modifiedTextareaValue);
    //});

    // Get the current date and time
    const now = new Date();

    // Format the date and time as a string
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const id = genRanHex(15);

    const newPosst = {
      // postid : id,
      title: newTitle,
      content: str,
      user: userrname,
      timestamp: timestamp,
    };

    var delayInMilliseconds = 100; //1 second = 1000ms

    

    posts.set(newPosst);
    document.querySelector("#newPost").value = "";
    document.querySelector("#newTitle").value = "";

    console.log(newPosst);

    setTimeout(function() {
      //your code to be executed after 1 second
      window.location.href = "index.html";
    }, 100);

    // window.location.href = "index.html";
  });
}

if(editform){
  console.log("inside editform");
    
  
  
    //editform.addEventListener("submit", (event) => {
  
      event.preventDefault();
      const editTitle = document.getElementById("editTitle");
                const editContent = document.getElementById("editPost");
  
                const qstring = window.location.search;
                const urlparams = new URLSearchParams(qstring);
                const ppostid = urlparams.get("id");
  
                const postRefff =  gun.get('devposts').get(ppostid);
                postRefff.once((post) => {
                  const postTitle = post.title;
                  const postContent = post.content;
                  const postedBy = post.user;
                  const postedAt = post.timestamp;
                
                console.log(postTitle);
      
                editTitle.value = postTitle;
                editContent.value = postContent.replaceAll("<br>\r\n", "\n");
      
                // Add an event listener to the edit form to handle the submit event
                const editForm = document.getElementById("editForm");
                editForm.addEventListener("submit", (event) => {
                  event.preventDefault();

                  const textareaValue = document.querySelector("#editPost").value;
                  // console.log(textareaValue);
                  // Replace newlines with HTML line breaks
                  const modifiedTextareaValue = textareaValue.replace(/\n/g, "<br>\r\n");
      
                  // Store the modified value in the object property
                  const str = modifiedTextareaValue;
      
                  // Update the post data in Gun
                  const updatedTitle = editTitle.value;
                  const updatedContent = str;
      
                  postRefff.put({ title: updatedTitle, content: updatedContent });
                   //console.log(newPosst);
                
                  setTimeout(function() {
                  //your code to be executed after 1 second
                  window.location.href = "index.html";
                    }, 100);
  
                  // window.location.href = "index.html";
                });
              });
  //});
  
  }



}); //DOMContent loaded